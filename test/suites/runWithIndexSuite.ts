export function runWithIndexSuite(withIndex: Function) {
  test("returns an async iterable", async () => {
    expect.assertions(1);
    await expect(withIndex([])).toBeAsyncIterable();
  });

  test("returns result as first element in tuple", async () => {
    expect.assertions(3);
    let input = ["foo", "bar", "baz"];
    let expectedResults = [...input];
    for await (let [result] of withIndex(input)) {
      expect(result).toEqual(expectedResults.shift());
    }
  });

  test("returns index as second element in tuple", async () => {
    expect.assertions(3);
    let input = ["foo", "bar", "baz"];
    let expectedResults = [0, 1, 2];
    for await (let [, index] of withIndex(input)) {
      expect(index).toEqual(expectedResults.shift());
    }
  });
}
