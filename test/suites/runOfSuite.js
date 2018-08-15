export function runOfSuite(of) {
  test("yields each argument", async () => {
    expect.assertions(3);

    let args = ["foo", "bar", "baz"];
    let expectedResults = [...args];

    for await (let result of of(...args)) {
      expect(result).toEqual(expectedResults.shift());
    }
  });
}
