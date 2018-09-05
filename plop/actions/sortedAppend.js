/* eslint-disable no-console */
const fs = require("fs").promises;
const { resolve } = require("path");

module.exports = async function sortedAppend(answers, config, plop) {
  try {
    let destPath = resolve(config.path);
    let destFile = await fs.readFile(destPath, "utf8");

    let { startPattern, endPattern = "\\s*// plop-end" } = config;

    let splitPattern = new RegExp(
      `(${startPattern}.*?\n?)([^]*?)(${endPattern})`,
      "gm"
    );

    let [head, startContents, sortableContents, ...tail] = destFile.split(
      splitPattern
    );

    let sortedContents = [
      ...sortableContents.split(/\n/g),
      plop.renderString(config.template, answers)
    ]
      .sort()
      .join("\n");

    let newFileContents = [
      head,
      startContents,
      ...sortedContents,
      ...tail
    ].join("");

    await fs.writeFile(destPath, newFileContents, "utf8");

    return config.path;
  } catch (err) {
    console.error(err);
  }
};
