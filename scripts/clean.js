/* eslint-disable no-console, typescript/no-var-requires */
const fsCallbacks = require("fs");
const path = require("path");

const fs = fsCallbacks.promises;

const ROOT_DIR = path.resolve(__dirname, "..");
const SRC_DIR = path.resolve(ROOT_DIR, "src");

(async () => {
  await Promise.all([removeBuildArtifacts(), removeTestArtifacts()]);
  console.log("Done!");
})();

async function removeBuildArtifacts() {
  let srcBasenames = (await fs.readdir(SRC_DIR))
    .concat(["cjs"])
    .map(stripExtension);

  let rootBasenames = new Map(
    (await fs.readdir(ROOT_DIR))
      .map(filename => path.resolve(ROOT_DIR, filename))
      .map(filepath => [filepath, stripExtension(filepath)])
  );

  let buildArtifacts = [...rootBasenames.entries()]
    .filter(([, basename]) => srcBasenames.includes(basename))
    .map(([fullpath]) => fullpath);

  return rmrf(buildArtifacts);
}

async function removeTestArtifacts() {
  let testArtifacts = ["../coverage", "../.stryker-tmp"].map(filename =>
    path.resolve(__dirname, filename)
  );

  return rmrf(testArtifacts);
}

async function rmrf(filepaths) {
  return Promise.all(filepaths.map(rm));
}

async function rmdir(dir) {
  let dirContents = (await fs.readdir(dir)).map(filepath =>
    path.resolve(dir, filepath)
  );

  await rmrf(dirContents);

  try {
    await fs.rmdir(dir);
    console.log(`Removed directory: ${dir}`);
  } catch (err) {
    console.error(err);
  }
}

async function rm(filepath) {
  try {
    await fs.unlink(filepath);
    console.log(`Removed: ${filepath}`);
  } catch (err) {
    if (err.code === "EISDIR") return rmdir(filepath);
    if (err.code === "ENOENT") return;
    console.error(err.message);
  }
}

function stripExtension(filename) {
  return path.basename(filename).replace(/\..*$/, "");
}
