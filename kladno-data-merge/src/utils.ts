import Row from "./Row";
import * as fs from "fs";
import { caseFilePath } from "./cases";
import * as path from "path";

const query = `
  *[ _type in ["sanity.imageAsset", "sanity.fileAsset"] ]
  {_id, "refs": count(*[ references(^._id) ])}
  [ refs == 0 ]
  ._id
`;

export async function deleteAllUnusedAssets(client) {
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
      } else {
        console.error(err.stack);
      }
    });
}

export function createCopyOfRealPeople(realPeople: Array<Row>) {
  const caseFileNames: string[] = fs.readdirSync(caseFilePath);

  const sourceDir = caseFilePath;
  const destDir = "./data/Copy of Real Cases";

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
  }

  let realCaseFiles = realPeople.map((row) => {
    let personName = `${row.KLFirstName} ${row.KLLastName}`;
    let correspondingCaseFile = caseFileNames.filter((item) =>
      item.includes(personName)
    )[0];

    return correspondingCaseFile;
  });

  console.log("Number of case files working with: ", realCaseFiles.length);

  // Read the source directory
  fs.readdir(sourceDir, (err, files) => {
    if (err) throw err;

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
          if (err) throw err;

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
