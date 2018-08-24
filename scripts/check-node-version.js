const os = require("os");
const semver = require("semver");
const pkg = require("../package.json");

let requiredVersion = pkg.engines.node;
let runtimeVersion = process.versions.node;

if (!semver.satisfies(runtimeVersion, requiredVersion)) {
  let platform = os.platform();

  console.error(
    [
      "",
      `Error: Unsupported node version: ${runtimeVersion}. Requires ${requiredVersion}.`,
      ""
    ].join("\n")
  );

  if (["darwin", "linux", "win32"].includes(platform)) {
    let nvmInfo = getNVMInfo(platform);

    console.error(
      [
        `If you have ${
          nvmInfo.bin
        } installed, you can use the correct version by running:`,
        "",
        `    ${nvmInfo.script}`,
        "",
        `For more information on ${nvmInfo.bin}, see ${nvmInfo.url}`,
        ""
      ].join("\n")
    );
  }

  process.exitCode = 1;
}

function getNVMInfo(platform) {
  switch (platform) {
    case "darwin":
    case "linux":
      return {
        bin: "nvm",
        script: "nvm use",
        url: "https://github.com/creationix/nvm"
      };

    default:
      return {
        bin: "nvm-windows",
        script: "nvm use",
        url: "https://github.com/coreybutler/nvm-windows"
      };
  }
}
