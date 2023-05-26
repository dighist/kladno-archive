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
pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.js";
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
const lawPath = "./data/Used laws";
const lawYears = fs.readdirSync(lawPath);
// remove .DS_Store from array
lawYears.shift();
// read pdfs in each year folder
// for each pdf, create a law object
// add the law object to the array of laws
// upload the array of laws to sanity
let laws = [];
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
const uploadPdf = (pdfPath) => __awaiter(void 0, void 0, void 0, function* () {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const response = yield client.assets.upload("file", pdfBuffer, {
        filename: path.basename(pdfPath),
        contentType: "application/pdf",
    });
    return response._id;
});
const uploadPdfs = () => __awaiter(void 0, void 0, void 0, function* () {
    for (let law of laws) {
        let pdfPath = `${lawPath}/${law.year}/${law.originalFilename}`;
        const fileId = yield limiter.schedule(() => uploadPdf(pdfPath));
        law.pdf.asset._ref = fileId;
    }
});
const uploadLaws = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const law of laws) {
        yield limiter
            .schedule(() => client.createOrReplace(law))
            .catch((err) => {
            console.error("Error creating or replacing document:", err);
        });
    }
});
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
//# sourceMappingURL=laws.js.map