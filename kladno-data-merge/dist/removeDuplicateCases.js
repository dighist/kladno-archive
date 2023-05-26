"use strict";
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
const client_1 = require("@sanity/client");
// Assuming `sanityClient` is already configured
const sanityClient = (0, client_1.createClient)({
    projectId: "ku7c6o27",
    dataset: "production",
    token: "sktK1vtVF280yXpcvtuS5tQea5KzUYmVspmiF5PNl374C5D9J6KYG96P5Jf1lzXCWnyTh2c0INg5d5XnA0gtO7edymv3teVucuDQqufuhQTxeQuwyM69ABXAkajQKpEL7VSsbaESOPgzwSCXL0oQ48v0ZYAfhDPzIbPcXjn7sQbbH3KU7Xw3",
    useCdn: false,
    apiVersion: "2023-03-12",
});
function removeAllButOneDuplicateCaseFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch all caseFile objects with the personProsecuted.name attribute
        const caseFiles = yield sanityClient.fetch('*[_type == "caseFile"] { _id, personProsecuted { _ref } }');
        console.log(caseFiles);
        // Group caseFiles by the combination of personProsecuted.firstName and personProsecuted.lastName
        const caseFilesByName = {};
        caseFiles.forEach((caseFile) => {
            const fullName = caseFile.personProsecuted._ref;
            if (caseFilesByName[fullName]) {
                caseFilesByName[fullName].push(caseFile);
            }
            else {
                caseFilesByName[fullName] = [caseFile];
            }
        });
        // Iterate over grouped caseFiles and delete duplicates
        for (const fullName in caseFilesByName) {
            const caseFilesGroup = caseFilesByName[fullName];
            // If there are duplicates, delete all but one
            if (caseFilesGroup.length > 1) {
                console.log(`Found ${caseFilesGroup.length} duplicates for caseFile with personProsecuted.firstName and personProsecuted.lastName "${fullName}"`);
                // Remove the first element as the representative and delete the rest
                caseFilesGroup.shift();
                for (const duplicateCaseFile of caseFilesGroup) {
                    yield sanityClient.delete(duplicateCaseFile._id);
                    console.log(`Deleted caseFile with ref "${duplicateCaseFile.personProsecuted._ref}"`);
                }
            }
        }
    });
}
// Call the function to remove duplicate caseFiles
removeAllButOneDuplicateCaseFiles().catch((error) => {
    console.error("Error removing duplicate caseFiles:", error);
});
//# sourceMappingURL=removeDuplicateCases.js.map