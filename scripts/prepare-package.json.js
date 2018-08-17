const fs = require("fs").promises;
const { join, resolve } = require("path");

const PKG_PATH = resolve(__dirname, "../package.json");
const TMP_DIR = resolve(__dirname, "../tmp");
const BACKUP_PATH = join(TMP_DIR, "package.json.orig");

preparePackageJSON();

async function preparePackageJSON() {
  await backup();

  let cleanPkg = getCleanPackageJSON();
  await save(cleanPkg);

  console.log("Done!");
}

async function backup() {
  try {
    await fs.mkdir(TMP_DIR);
  } catch (err) {
    if (err.code !== "EEXIST") console.error(err);
  }

  try {
    await fs.copyFile(PKG_PATH, BACKUP_PATH);
  } catch (err) {
    console.error(err);
  }
}

function getCleanPackageJSON() {
  // Deep clone to prevent any potential weirdness w/r/t to the module cache
  let cleanPkg = JSON.parse(JSON.stringify(require(PKG_PATH)));

  delete cleanPkg.scripts.postinstall;
  delete cleanPkg.buildDependencies;
  delete cleanPkg.dependencies["postinstall-build"];

  return cleanPkg;
}

async function save(cleanPkg) {
  fs.writeFile(PKG_PATH, `${JSON.stringify(cleanPkg, null, 2)}\n`);
}
