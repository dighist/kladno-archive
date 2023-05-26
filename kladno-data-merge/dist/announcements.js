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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const client_1 = require("@sanity/client");
const image_url_1 = __importDefault(require("@sanity/image-url"));
const bottleneck_1 = __importDefault(require("bottleneck"));
const pdfjsLib = __importStar(require("pdfjs-dist/build/pdf"));
const stringSimilarity = __importStar(require("string-similarity"));
pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.js";
const FETTE = {
    _createdAt: "2023-04-13T13:49:54Z",
    _id: "c80532d0-e8dc-4339-bbd1-c487d2097eee",
    _rev: "OCiAl6zKZ9GxYuo0i0CJM7",
    _type: "institution",
    _updatedAt: "2023-04-13T13:49:54Z",
    name: "Böhmisch-Mährischer Verband für Milch und Fette",
};
const MINISTER = {
    _createdAt: "2023-04-20T20:44:36Z",
    _id: "ed2d0925-6fcb-420c-ab59-af6c33dc55c5",
    _rev: "Sy21opM66QExGmxH5Ip0vl",
    _type: "institution",
    _updatedAt: "2023-04-20T20:44:36Z",
    name: "Minister für Landwirtschaft",
};
const GETREIDE = {
    _createdAt: "2023-04-13T13:49:18Z",
    _id: "f50d49e1-cd77-4c38-80b3-9c336a36982c",
    _rev: "OCiAl6zKZ9GxYuo0i0BxGV",
    _type: "institution",
    _updatedAt: "2023-04-13T13:49:18Z",
    name: "Getreide-Gesellschaft",
};
const MINISTERIUM = {
    _createdAt: "2023-04-13T13:48:52Z",
    _id: "fce02c61-7dd9-45a3-841d-ee85b51a0dc2",
    _rev: "OCiAl6zKZ9GxYuo0i0BXSt",
    _type: "institution",
    _updatedAt: "2023-04-13T13:48:52Z",
    name: "Ministerium für Landwirtschaft",
};
const OBSERTE = {
    _createdAt: "2023-04-13T13:48:28Z",
    _id: "ed445198-b06b-440b-bc7d-4e9ccb8af436",
    _rev: "aj7aDL3Q9vY39rtZZDTeRf",
    _type: "institution",
    _updatedAt: "2023-04-13T13:48:28Z",
    name: "Oberste Preisbehörde",
};
const GETREIDWIRTSCHAFT = {
    _createdAt: "2023-04-13T13:47:37Z",
    _id: "df32bd20-5e24-45d3-9848-6d051a3f5edd",
    _rev: "OCiAl6zKZ9GxYuo0i0AgHj",
    _type: "institution",
    _updatedAt: "2023-04-13T13:47:37Z",
    name: "Böhmisch-Mährischer Verband für die Getreidewirtschaft",
};
const institutionsObjs = [
    FETTE,
    MINISTER,
    GETREIDE,
    MINISTERIUM,
    OBSERTE,
    GETREIDWIRTSCHAFT,
];
const limiter = new bottleneck_1.default({
    reservoir: 25,
    reservoirRefreshAmount: 25,
    reservoirRefreshInterval: 1000, // interval in milliseconds
});
const client = (0, client_1.createClient)({
    projectId: "ku7c6o27",
    dataset: "production",
    token: "sktK1vtVF280yXpcvtuS5tQea5KzUYmVspmiF5PNl374C5D9J6KYG96P5Jf1lzXCWnyTh2c0INg5d5XnA0gtO7edymv3teVucuDQqufuhQTxeQuwyM69ABXAkajQKpEL7VSsbaESOPgzwSCXL0oQ48v0ZYAfhDPzIbPcXjn7sQbbH3KU7Xw3",
    useCdn: false,
    apiVersion: "2023-03-12",
});
const builder = (0, image_url_1.default)(client);
const announcementPath = "./data/Used announcements";
const announcementYears = fs.readdirSync(announcementPath);
// remove .DS_Store from array
announcementYears.shift();
// read pdfs in each year folder
// for each pdf, create a announcement object
// add the announcement object to the array of announcements
// upload the array of announcements to sanity
let announcements = [];
for (let year of announcementYears) {
    let institutions = fs.readdirSync(`${announcementPath}/${year}`);
    for (let institution of institutions) {
        let files = fs.readdirSync(`${announcementPath}/${year}/${institution}`);
        // remove any files without ".pdf" in the name
        files = files.filter((file) => file.includes(".pdf"));
        // set the fileInstitutionObj based on the institution name that has the highest number of similar characters
        let fileInstitutionObj = institutionsObjs[0];
        let highestSimilarity = 0;
        for (let institutionObj of institutionsObjs) {
            let similarity = stringSimilarity.compareTwoStrings(institutionObj.name, institution);
            if (similarity > highestSimilarity) {
                highestSimilarity = similarity;
                fileInstitutionObj = institutionObj;
            }
        }
        for (let file of files) {
            let announcement_number = file.split("_")[0]; // need to remove the .pdf from the end
            let title = `announcement-${year}-${announcement_number}-${institution}}`;
            // if '.pdf' in title, remove it
            if (title.includes(".pdf")) {
                title = title.replace(".pdf", "");
            }
            let announcement = {
                _id: `announcement-${year}-${announcement_number}`,
                _type: `announcement`,
                title: title,
                year: year,
                originalFilename: file,
                institutionFilePath: institution,
                institution: {
                    _type: "reference",
                    _ref: fileInstitutionObj._id,
                },
                pdf: {
                    _type: "file",
                    asset: {
                        _type: "reference",
                        _ref: `file-announcement-${year}-${announcement_number}`,
                    },
                },
            };
            announcements.push(announcement);
        }
    }
}
// use subset of 3 announcements for testing
// announcements = announcements.slice(0, 3);
const uploadPdf = (pdfPath) => __awaiter(void 0, void 0, void 0, function* () {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const response = yield client.assets.upload("file", pdfBuffer, {
        filename: path.basename(pdfPath),
        contentType: "application/pdf",
    });
    return response._id;
});
const uploadPdfs = () => __awaiter(void 0, void 0, void 0, function* () {
    for (let announcement of announcements) {
        let pdfPath = `${announcementPath}/${announcement.year}/${announcement.institutionFilePath}/${announcement.originalFilename}`;
        const fileId = yield limiter.schedule(() => uploadPdf(pdfPath));
        announcement.pdf.asset._ref = fileId;
    }
});
const uploadAnnouncements = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const announcement of announcements) {
        yield limiter
            .schedule(() => client.createOrReplace(announcement))
            .catch((err) => {
            console.error("Error creating or replacing document:", err);
        });
    }
});
uploadPdfs().then(() => {
    console.log("⭐️ completed uploading pdfs");
    uploadAnnouncements().then(() => {
        console.log("⭐️ completed uploading announcements");
    });
});
//# sourceMappingURL=announcements.js.map