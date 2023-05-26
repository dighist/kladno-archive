import * as fs from "fs";
import * as path from "path";
import * as Tesseract from "tesseract.js";
import pdfParse from "pdf-parse";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import Bottleneck from "bottleneck";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { createWorker } from "tesseract.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.js";

const limiter = new Bottleneck({
  reservoir: 25, // initial amount of available requests
  reservoirRefreshAmount: 25, // amount of requests added at each interval
  reservoirRefreshInterval: 1000, // interval in milliseconds
});

const client = createClient({
  projectId: "ku7c6o27",
  dataset: "production",
  token:
    "sktK1vtVF280yXpcvtuS5tQea5KzUYmVspmiF5PNl374C5D9J6KYG96P5Jf1lzXCWnyTh2c0INg5d5XnA0gtO7edymv3teVucuDQqufuhQTxeQuwyM69ABXAkajQKpEL7VSsbaESOPgzwSCXL0oQ48v0ZYAfhDPzIbPcXjn7sQbbH3KU7Xw3",
  useCdn: false, // We can't use the CDN for writing
  apiVersion: "2023-03-12",
});

const builder = imageUrlBuilder(client);

const lawPath = "./data/Used laws";
const lawYears: string[] = fs.readdirSync(lawPath);
// remove .DS_Store from array
lawYears.shift();

// read pdfs in each year folder
// for each pdf, create a law object
// add the law object to the array of laws
// upload the array of laws to sanity

let laws: any[] = [];

for (let year of lawYears) {
  let files = fs.readdirSync(`${lawPath}/${year}`);

  for (let file of files) {
    let law_number = file.split("_")[0]; // need to remove the .pdf from the end
    let title = `law-${year}-${law_number}`;

    // if '.pdf' in title, remove it
    if (title.includes(".pdf")) {
      title = title.replace(".pdf", "");
    }

    let law = {
      _id: `law-${year}-${law_number}`,
      _type: `law`,
      title: title,
      year: year,
      originalFilename: file,
      pdf: {
        _type: "file",
        asset: {
          _type: "reference",
          _ref: `file-law-${year}-${law_number}`,
        },
      },
    };
    laws.push(law);
  }
}

// use subset of 3 laws for testing
// laws = laws.slice(0, 4);

const uploadPdf = async (pdfPath: string): Promise<string> => {
  const pdfBuffer = fs.readFileSync(pdfPath);

  const response = await client.assets.upload("file", pdfBuffer, {
    filename: path.basename(pdfPath),
    contentType: "application/pdf",
  });

  return response._id;
};

const uploadPdfs = async () => {
  for (let law of laws) {
    let pdfPath = `${lawPath}/${law.year}/${law.originalFilename}`;
    const fileId = await limiter.schedule(() => uploadPdf(pdfPath));
    law.pdf.asset._ref = fileId;
  }
};

const uploadLaws = async (): Promise<void> => {
  for (const law of laws) {
    await limiter
      .schedule(() => client.createOrReplace(law))
      .catch((err) => {
        console.error("Error creating or replacing document:", err);
      });
  }
};

uploadPdfs().then(() => {
  console.log("⭐️ completed uploading pdfs");
  uploadLaws().then(() => {
    console.log("⭐️ completed uploading laws");
  });
});

// // createOrReplaceLawPdfAssets all of the law pdf assets in sanity and save the asset ids to the law objects
// async function createOrReplaceLawPdfAssets() {
//   for (let law of laws) {
//     try {
//       let asset = await client.assets.upload(
//         "file",
//         fs.createReadStream(`${lawPath}/${law.year}/${law.originalFilename}`),
//         {
//           filename: law.originalFilename,
//         }
//       );
//       law.pdf.asset._ref = asset._id;
//     } catch (err) {
//       console.log(err);
//     }
//   }
// }

// // createOrReplaceLaws all of the law objects in sanity
// async function createOrReplaceLaws() {
//   for (let law of laws) {
//     try {
//       await client.createOrReplace(law).then((res) => console.log(res));
//     } catch (err) {
//       // if 'immutable attribute "_type" may not be modified' error, then delete the law and try again
//       console.log(err);

//       if (
//         err.message.includes('immutable attribute "_type" may not be modified')
//       ) {
//         await client.delete(law._id).then((res) => console.log(res));
//         await client.createOrReplace(law).then((res) => console.log(res));
//       }
//     }
//   }
// }

// createOrReplaceLawPdfAssets().then((res) => {
//   console.log("completed creating law pdf assets");
//   createOrReplaceLaws();
// });
