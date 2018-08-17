const fs = require("fs").promises;
const { join, resolve } = require("path");

const PKG_PATH = resolve(__dirname, "../package.json");
const TMP_DIR = resolve(__dirname, "../tmp");
const BACKUP_PATH = join(TMP_DIR, "package.json.orig");

restorePackageJSON();

async function restorePackageJSON() {
  await fs.copyFile(BACKUP_PATH, PKG_PATH);
  console.log("Done!");
}
