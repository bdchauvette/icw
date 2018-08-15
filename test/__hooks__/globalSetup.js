const MINIMUM_NODE_VERSION = 10;

module.exports = async () => {
  let [major] = process.versions.node.split(".");

  if (major < MINIMUM_NODE_VERSION) {
    throw new Error(
      [
        "",
        "-".repeat(55),
        "",
        `The test suite requires at least Node v${MINIMUM_NODE_VERSION} to run.`,
        `Current version: ${process.version}`,
        "",
        "-".repeat(55),
        ""
      ].join("\n")
    );
  }
};
