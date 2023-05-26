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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCopyOfRealPeople = exports.deleteAllUnusedAssets = void 0;
const fs = __importStar(require("fs"));
const cases_1 = require("./cases");
const path = __importStar(require("path"));
const query = `
  *[ _type in ["sanity.imageAsset", "sanity.fileAsset"] ]
  {_id, "refs": count(*[ references(^._id) ])}
  [ refs == 0 ]
  ._id
`;
function deleteAllUnusedAssets(client) {
    return __awaiter(this, void 0, void 0, function* () {
        client
            .fetch(query)
            .then((ids) => {
            if (!ids.length) {
                console.log("No assets to delete");
                return true;
            }
            console.log(`Deleting ${ids.length} assets`);
            return ids
                .reduce((trx, id) => trx.delete(id), client.transaction())
                .commit()
                .then(() => console.log("Done deleting unused assets!"));
        })
            .catch((err) => {
            if (err.message.includes("Insufficient permissions")) {
                console.error(err.message);
                console.error("Did you forget to pass `--with-user-token`?");
            }
            else {
                console.error(err.stack);
            }
        });
    });
}
exports.deleteAllUnusedAssets = deleteAllUnusedAssets;
function createCopyOfRealPeople(realPeople) {
    const caseFileNames = fs.readdirSync(cases_1.caseFilePath);
    const sourceDir = cases_1.caseFilePath;
    const destDir = "./data/Copy of Real Cases";
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir);
    }
    let realCaseFiles = realPeople.map((row) => {
        let personName = `${row.KLFirstName} ${row.KLLastName}`;
        let correspondingCaseFile = caseFileNames.filter((item) => item.includes(personName))[0];
        return correspondingCaseFile;
    });
    console.log("Number of case files working with: ", realCaseFiles.length);
    // Read the source directory
    fs.readdir(sourceDir, (err, files) => {
        if (err)
            throw err;
        // Loop through each directory in the source directory
        files.forEach((dir) => {
            if (realCaseFiles.includes(dir)) {
                const srcDir = path.join(sourceDir, dir);
                const destSubdir = path.join(destDir, dir);
                // Create the destination subdirectory if it doesn't already exist
                if (!fs.existsSync(destSubdir)) {
                    fs.mkdirSync(destSubdir);
                }
                // Loop through each file in the directory
                fs.readdir(srcDir, (err, files) => {
                    if (err)
                        throw err;
                    // Copy each file to the destination subdirectory
                    files.forEach((file) => {
                        const srcFile = path.join(srcDir, file);
                        const destFile = path.join(destSubdir, file);
                        const readStream = fs.createReadStream(srcFile);
                        const writeStream = fs.createWriteStream(destFile);
                        readStream.pipe(writeStream);
                    });
                });
            }
        });
    });
}
exports.createCopyOfRealPeople = createCopyOfRealPeople;
//# sourceMappingURL=utils.js.map