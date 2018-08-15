export function runOfSuite(of) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(of(1, 2, 3)).toReturnSameAsyncIterator();
  });

  test("yields each argument", async () => {
    expect.assertions(3);

    let args = ["foo", "bar", "baz"];
    let expectedResults = [...args];

    for await (let result of of(...args)) {
      expect(result).toEqual(expectedResults.shift());
    }
  });
}
