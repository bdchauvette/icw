module.exports = config => {
  config.set({
    packageManager: "npm",
    testRunner: "jest",
    mutate: ["src/**/*.ts"],

    mutator: "typescript",

    reporter: ["clear-text", "progress"],
    coverageAnalysis: "off"
  });
};
