export function ofSuite(of: Function) {
  test("returns an async iterable", async () => {
    expect.assertions(1);
    await expect(of([1, 2, 3])).toBeAsyncIterable();
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
