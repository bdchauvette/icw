import * as icw from "../src";

test.each([
  // plop: Exports
  "ICW",
  "concat",
  "drain",
  "every",
  "filter",
  "find",
  "findIndex",
  "findLast",
  "findLastIndex",
  "first",
  "flat",
  "flatMap",
  "forEach",
  "from",
  "head",
  "includes",
  "indexOf",
  "last",
  "lastIndexOf",
  "map",
  "nth",
  "of",
  "pipeline",
  "reduce",
  "reject",
  "scan",
  "skip",
  "skipLast",
  "skipWhile",
  "some",
  "tail",
  "take",
  "takeLast",
  "takeWhile",
  "tap",
  "toArray",
  "withIndex"
  // plop-end
])("exports %s", async exportName => {
  expect.assertions(1);
  let expectedExport = (await import(`../src/${exportName}`))[exportName];
  expect(icw[exportName]).toBe(expectedExport);
});