import * as icw from "../src";

test.each([
  // plop: Exports
  "ICW",
  "drain",
  "every",
  "filter",
  "find",
  "findIndex",
  "findLast",
  "findLastIndex",
  "first",
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
