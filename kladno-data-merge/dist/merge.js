"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.caseFilePath = void 0;
const fs = __importStar(require("fs"));
const client_1 = require("@sanity/client");
const unidecode_1 = __importDefault(require("unidecode"));
const moment_1 = __importDefault(require("moment"));
const utils_1 = require("./utils");
const image_url_1 = __importDefault(require("@sanity/image-url"));
const client = (0, client_1.createClient)({
    projectId: "ku7c6o27",
    dataset: "production",
    token: "sktK1vtVF280yXpcvtuS5tQea5KzUYmVspmiF5PNl374C5D9J6KYG96P5Jf1lzXCWnyTh2c0INg5d5XnA0gtO7edymv3teVucuDQqufuhQTxeQuwyM69ABXAkajQKpEL7VSsbaESOPgzwSCXL0oQ48v0ZYAfhDPzIbPcXjn7sQbbH3KU7Xw3",
    useCdn: false,
    apiVersion: "2023-03-12",
});
const builder = (0, image_url_1.default)(client);
const data = require("../data/data.json");
let registerRows = data[2].data;
// registerRows = registerRows.slice(0, 40); // smaller number for testing to start
exports.caseFilePath = "./data/Cases";
const announcementPath = "./data/Used announcements";
const lawPath = "./data/Used laws";
const caseFileNames = fs.readdirSync(exports.caseFilePath);
const announcementYears = fs.readdirSync(announcementPath);
const lawYears = fs.readdirSync(lawPath);
let realPersonCount = 0;
function filterRows(row) {
    let rowPersonInCaseFiles = caseFileNames
        .map((filename) => {
        return filename.includes(`${row.KLFirstName} ${row.KLLastName}`);
    })
        .some((elm) => elm == true);
    return rowPersonInCaseFiles;
}
const PERIOD_DATE_FORMAT = "DD.MM.YYYY";
function transform(row) {
    let personName = `${row.KLFirstName} ${row.KLLastName}`;
    let correspondingCaseFile = caseFileNames.filter((item) => item.includes(personName))[0];
    const CASEFILE_ID = `case-${row.KLID}`;
    let personId = (0, unidecode_1.default)(`person-${row.KLFirstName}-${row.KLLastName}`);
    let person = {
        _id: personId,
        _type: "person",
        firstName: row.KLFirstName,
        lastName: row.KLLastName,
        gender: row.KLGender,
        residence: row.KLResidenceCZ,
    };
    let filenames = fs.readdirSync(`${exports.caseFilePath}/${correspondingCaseFile}`);
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
        dateIn: (0, moment_1.default)(row.KLCriminalChargesDateIN, PERIOD_DATE_FORMAT).toDate(),
        datePenalty: (0, moment_1.default)(row.KLPenaltyNoticeDate, PERIOD_DATE_FORMAT).toDate(),
        originalFilename: correspondingCaseFile,
    };
    return {
        person: person,
        caseFile: caseFile,
        individualCaseFiles: individualCaseFiles,
    };
}
function makeAllDocuments(client, startAmt = 0, sliceAmt = 99999) {
    return __awaiter(this, void 0, void 0, function* () {
        // we need to look at the register rows that have corresponding case files
        let realPeople = registerRows.filter(filterRows);
        realPeople = realPeople.slice(startAmt, sliceAmt); // for testing
        (0, utils_1.createCopyOfRealPeople)(realPeople);
        // create documents from each type
        let docs = realPeople.map(transform);
        let personDocs = docs.map((doc) => doc.person);
        let caseFileDocs = docs.map((doc) => doc.caseFile);
        let individualCaseFileDocs = docs.map((doc) => doc.individualCaseFiles);
        let flattenedCaseFileDocs = individualCaseFileDocs.flat();
        // commit transactions to sanity (to not overwhelm)
        let transaction = yield client.transaction();
        personDocs.forEach((document) => {
            transaction.createOrReplace(document);
        });
        caseFileDocs.forEach((document) => {
            transaction.createOrReplace(document);
        });
        flattenedCaseFileDocs.forEach((document) => {
            transaction.createOrReplace(document);
        });
        yield transaction.commit().then((res) => {
            console.log("Made all documents");
        });
        return caseFileDocs;
    });
}
function progressBar(progress, total, width) {
    const percent = (progress / total) * 100;
    const numChars = Math.floor((percent / 100) * width);
    const bar = Array(numChars).fill("=").join("") +
        Array(width - numChars)
            .fill(" ")
            .join("");
    return `[${bar}] ${percent.toFixed(2)}%`;
}
function uploadCaseFileImages(caseFile) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting to upload for ", caseFile.originalFilename);
        let folder = caseFile.originalFilename;
        let filenames = fs.readdirSync(`${exports.caseFilePath}/${folder}`);
        let ix = 0;
        for (const filename of filenames) {
            const bar = progressBar(ix + 1, filenames.length, 20);
            process.stdout.write(`\r${bar}`);
            yield client.assets
                .upload("image", fs.createReadStream(`${exports.caseFilePath}/${folder}/${filename}`), {
                filename: `${caseFile._id}-img-${ix}`,
            })
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
    });
}
function uploadAllFiles(caseFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        let count = 1;
        for (const file of caseFiles) {
            console.log(`\n${count}/${caseFiles.length}`);
            try {
                const response = yield uploadCaseFileImages(file);
                console.log(response);
            }
            catch (error) {
                console.log("💔", file.originalFilename, error);
            }
            count++;
        }
    });
}
console.log("About to upload each image for the cases");
makeAllDocuments(client, 0, 99).then((caseFileDocs) => {
    uploadAllFiles(caseFileDocs).then(() => {
        (0, utils_1.deleteAllUnusedAssets)(client);
    });
});
//# sourceMappingURL=merge.js.map