import Row from "./Row";
import * as fs from "fs";
import _, { slice } from "lodash";
import { createClient } from "@sanity/client";
import unidecode from "unidecode";
import moment from "moment";
import PQueue from "p-queue";
import { createCopyOfRealPeople, deleteAllUnusedAssets } from "./utils";
import imageUrlBuilder from "@sanity/image-url";

const data = require("../data/data.json");
let registerRows: Row[] = data[2].data;

export const caseFilePath = "./data/Cases";
const announcementPath = "./data/Used announcements";
const lawPath = "./data/Used laws";

const caseFileNames: string[] = fs.readdirSync(caseFilePath);

function filterRows(row: Row) {
  let rowPersonInCaseFiles = caseFileNames
    .map((filename) => {
      return filename.includes(`${row.KLFirstName} ${row.KLLastName}`);
    })
    .some((elm) => elm == true);
  return rowPersonInCaseFiles;
}

let realPeople = registerRows.filter(filterRows);

console.log("realPeople", realPeople.length);
console.log("registerRows", registerRows.length);
console.log("caseFileNames", caseFileNames.length);
