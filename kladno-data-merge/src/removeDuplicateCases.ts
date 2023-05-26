import { createClient } from "@sanity/client";

// Assuming `sanityClient` is already configured
const sanityClient = createClient({
  projectId: "ku7c6o27",
  dataset: "production",
  token:
    "sktK1vtVF280yXpcvtuS5tQea5KzUYmVspmiF5PNl374C5D9J6KYG96P5Jf1lzXCWnyTh2c0INg5d5XnA0gtO7edymv3teVucuDQqufuhQTxeQuwyM69ABXAkajQKpEL7VSsbaESOPgzwSCXL0oQ48v0ZYAfhDPzIbPcXjn7sQbbH3KU7Xw3",
  useCdn: false, // We can't use the CDN for writing
  apiVersion: "2023-03-12",
});

async function removeAllButOneDuplicateCaseFiles() {
  // Fetch all caseFile objects with the personProsecuted.name attribute
  const caseFiles = await sanityClient.fetch(
    '*[_type == "caseFile"] { _id, personProsecuted { _ref } }'
  );

  console.log(caseFiles);

  // Group caseFiles by the combination of personProsecuted.firstName and personProsecuted.lastName
  const caseFilesByName: { [name: string]: any[] } = {};
  caseFiles.forEach((caseFile: any) => {
    const fullName = caseFile.personProsecuted._ref;
    if (caseFilesByName[fullName]) {
      caseFilesByName[fullName].push(caseFile);
    } else {
      caseFilesByName[fullName] = [caseFile];
    }
  });

  // Iterate over grouped caseFiles and delete duplicates
  for (const fullName in caseFilesByName) {
    const caseFilesGroup = caseFilesByName[fullName];

    // If there are duplicates, delete all but one
    if (caseFilesGroup.length > 1) {
      console.log(
        `Found ${caseFilesGroup.length} duplicates for caseFile with personProsecuted.firstName and personProsecuted.lastName "${fullName}"`
      );

      // Remove the first element as the representative and delete the rest
      caseFilesGroup.shift();
      for (const duplicateCaseFile of caseFilesGroup) {
        await sanityClient.delete(duplicateCaseFile._id);
        console.log(
          `Deleted caseFile with ref "${duplicateCaseFile.personProsecuted._ref}"`
        );
      }
    }
  }
}

// Call the function to remove duplicate caseFiles
removeAllButOneDuplicateCaseFiles().catch((error) => {
  console.error("Error removing duplicate caseFiles:", error);
});
