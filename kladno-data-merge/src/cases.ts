import Row from "./Row";
import * as fs from "fs";
import _, { slice } from "lodash";
import { createClient } from "@sanity/client";
import unidecode from "unidecode";
import moment from "moment";
import PQueue from "p-queue";
import { createCopyOfRealPeople, deleteAllUnusedAssets } from "./utils";
import imageUrlBuilder from "@sanity/image-url";

const client = createClient({
  projectId: "ku7c6o27",
  dataset: "production",
  token:
    "sktK1vtVF280yXpcvtuS5tQea5KzUYmVspmiF5PNl374C5D9J6KYG96P5Jf1lzXCWnyTh2c0INg5d5XnA0gtO7edymv3teVucuDQqufuhQTxeQuwyM69ABXAkajQKpEL7VSsbaESOPgzwSCXL0oQ48v0ZYAfhDPzIbPcXjn7sQbbH3KU7Xw3",
  useCdn: false, // We can't use the CDN for writing
  apiVersion: "2023-03-12",
});

const builder = imageUrlBuilder(client);

const data = require("../data/data.json");
let registerRows: Row[] = data[2].data;
// registerRows = registerRows.slice(0, 40); // smaller number for testing to start

export const caseFilePath = "./data/Cases";
const announcementPath = "./data/Used announcements";
const lawPath = "./data/Used laws";

const caseFileNames: string[] = fs.readdirSync(caseFilePath);
const announcementYears: string[] = fs.readdirSync(announcementPath);
const lawYears: string[] = fs.readdirSync(lawPath);

let realPersonCount = 0;

function filterRows(row: Row) {
  let rowPersonInCaseFiles = caseFileNames
    .map((filename) => {
      return filename.includes(`${row.KLFirstName} ${row.KLLastName}`);
    })
    .some((elm) => elm == true);
  return rowPersonInCaseFiles;
}

const PERIOD_DATE_FORMAT = "DD.MM.YYYY";

function transform(row: Row) {
  let personName = `${row.KLFirstName} ${row.KLLastName}`;
  let correspondingCaseFile = caseFileNames.filter((item) =>
    item.includes(personName)
  )[0];

  const CASEFILE_ID = `case-${row.KLID}`;

  let personId = unidecode(`person-${row.KLFirstName}-${row.KLLastName}`);
  let person = {
    _id: personId,
    _type: "person",
    firstName: row.KLFirstName,
    lastName: row.KLLastName,
    gender: row.KLGender,
    residence: row.KLResidenceCZ,
  };

  let filenames = fs.readdirSync(`${caseFilePath}/${correspondingCaseFile}`);
  let individualCaseFiles = filenames.map((filename, ix) => {
    return {
      _id: `${CASEFILE_ID}-doc-${ix}`,
      _type: "caseFileDocument",
      originalFilename: `${filename}`,
    };
  });

  let mappedCaseFiles = individualCaseFiles.map((document) => {
    return { _type: "reference", _ref: document._id, _key: document._id };
  });
  // console.log(mappedCaseFiles);

  let caseFile = {
    _id: CASEFILE_ID,
    _type: "caseFile",
    personProsecuted: {
      _type: "reference",
      _ref: personId,
    },
    documents: mappedCaseFiles,
    dateIn: moment(row.KLCriminalChargesDateIN, PERIOD_DATE_FORMAT).toDate(),
    datePenalty: moment(row.KLPenaltyNoticeDate, PERIOD_DATE_FORMAT).toDate(),
    originalFilename: correspondingCaseFile,
  };

  return {
    person: person,
    caseFile: caseFile,
    individualCaseFiles: individualCaseFiles,
  };
}

async function makeAllDocuments(client, startAmt = 0, sliceAmt = 99999) {
  // we need to look at the register rows that have corresponding case files
  let realPeople = registerRows.filter(filterRows);
  realPeople = realPeople.slice(startAmt, sliceAmt); // for testing
  createCopyOfRealPeople(realPeople);

  // create documents from each type
  let docs = realPeople.map(transform);
  let personDocs = docs.map((doc) => doc.person);
  let caseFileDocs = docs.map((doc) => doc.caseFile);
  let individualCaseFileDocs = docs.map((doc) => doc.individualCaseFiles);
  let flattenedCaseFileDocs = individualCaseFileDocs.flat();

  // commit transactions to sanity (to not overwhelm)
  let transaction = await client.transaction();
  personDocs.forEach((document) => {
    transaction.createOrReplace(document);
  });
  caseFileDocs.forEach((document) => {
    transaction.createOrReplace(document);
  });
  flattenedCaseFileDocs.forEach((document) => {
    transaction.createOrReplace(document);
  });
  await transaction.commit().then((res) => {
    console.log("Made all documents");
  });
  return caseFileDocs;
}

function progressBar(progress: number, total: number, width: number): string {
  const percent = (progress / total) * 100;
  const numChars = Math.floor((percent / 100) * width);
  const bar =
    Array(numChars).fill("=").join("") +
    Array(width - numChars)
      .fill(" ")
      .join("");
  return `[${bar}] ${percent.toFixed(2)}%`;
}

async function uploadCaseFileImages(caseFile) {
  console.log("Starting to upload for ", caseFile.originalFilename);
  let folder = caseFile.originalFilename;
  let filenames = fs.readdirSync(`${caseFilePath}/${folder}`);

  let ix = 0;
  for (const filename of filenames) {
    const bar = progressBar(ix + 1, filenames.length, 20);
    process.stdout.write(`\r${bar}`);
    await client.assets
      .upload(
        "image",
        fs.createReadStream(`${caseFilePath}/${folder}/${filename}`),
        {
          filename: `${caseFile._id}-img-${ix}`,
        }
      )
      .then((image) => {
        // Update the document with the image URL
        client
          .patch(`${caseFile._id}-doc-${ix}`)
          .set({
            scan: {
              _type: "image",
              asset: { _ref: image._id },
              _key: image.originalFilename,
            },
          })
          .commit()
          .catch((error) => {
            console.error("Error updating document with image URL", error);
          });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        if (error.response.body.message.includes("API")) {
          setTimeout(() => {
            uploadCaseFileImages(caseFile)
              .then(() => {
                console.log("Finished from second try");
              })
              .catch((error) => {
                console.error(error);
              });
          }, 2000);
        }
      });
    ix++;
  }

  return "\nCompleted upload for " + caseFile.originalFilename;
}

async function uploadAllFiles(caseFiles) {
  let count = 1;
  for (const file of caseFiles) {
    console.log(`\n${count}/${caseFiles.length}`);
    try {
      const response = await uploadCaseFileImages(file);
      console.log(response);
    } catch (error) {
      console.log("💔", file.originalFilename, error);
    }
    count++;
  }
}

console.log("About to upload each image for the cases");
makeAllDocuments(client, 0, 99).then((caseFileDocs) => {
  uploadAllFiles(caseFileDocs).then(() => {
    deleteAllUnusedAssets(client);
  });
});
