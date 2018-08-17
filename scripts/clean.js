const fs = require("fs").promises;
const { basename, resolve } = require("path");
const pkg = require("../package.json");

const ROOT_DIR = resolve(__dirname, "..");
const SRC_DIR = resolve(ROOT_DIR, "src");

clean();

let deletedFileCount = 0;
let deletedDirCount = 0;

async function clean() {
  await Promise.all([
    removeBuildArtifacts(),
    removeTestArtifacts(),
    removeTempFiles()
  ]);

  console.log(
    `Deleted ${deletedFileCount} files and ${deletedDirCount} directories`
  );
}

async function removeBuildArtifacts() {
  let srcBasenames = (await fs.readdir(SRC_DIR))
    .concat(["cjs"])
    .map(stripExtension);

  let rootBasenames = new Map(
    (await fs.readdir(ROOT_DIR))
      .map(filename => resolve(ROOT_DIR, filename))
      .map(filepath => [filepath, stripExtension(filepath)])
  );

  let buildArtifacts = [...rootBasenames.entries()]
    .filter(([, basename]) => srcBasenames.includes(basename))
    .map(([fullpath]) => fullpath);

  return rmrf(...buildArtifacts);
}

function stripExtension(filename) {
  return basename(filename).replace(/\..*$/, "");
}

async function removeTestArtifacts() {
  let testArtifacts = ["../coverage", "../.stryker-tmp"].map(filename =>
    resolve(__dirname, filename)
  );

  return rmrf(...testArtifacts);
}

async function removeTempFiles() {
  let tempFiles = ["../tmp", `../icw-icw-${pkg.version}.tgz`].map(filename =>
    resolve(__dirname, filename)
  );

  return rmrf(...tempFiles);
}

async function rmrf(...filepaths) {
  return Promise.all(filepaths.map(rm));
}

async function rm(filepath) {
  try {
    await fs.unlink(filepath);
    deletedFileCount += 1;
  } catch (err) {
    if (err.code === "EISDIR") return rmdir(filepath);
    if (err.code === "ENOENT") return;
    console.error(err.message);
  }
}

async function rmdir(dir) {
  try {
    let relativeFilepaths = await fs.readdir(dir);
    let filepaths = relativeFilepaths.map(filepath => resolve(dir, filepath));
    await rmrf(...filepaths);
    await fs.rmdir(dir);
    deletedDirCount += 1;
  } catch (err) {
    console.error(err);
  }
}
