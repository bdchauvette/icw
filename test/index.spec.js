import * as icw from "../src";

test.each([
  // $plop: Exported functions
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
  "reduce",
  "reject",
  "scan",
  "skip",
  "skipWhile",
  "some",
  "tail",
  "take",
  "takeWhile",
  "tap",
  "toArray",
  "withIndex"
])("exports %s", async exportName => {
  expect.assertions(1);
  let expectedExport = (await import(`../src/${exportName}`))[exportName];
  expect(icw[exportName]).toBe(expectedExport);
});
