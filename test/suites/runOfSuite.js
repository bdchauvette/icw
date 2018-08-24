export function runOfSuite(of) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(of()).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(of()).toBeCloseableAsyncIterator();
  });

  test("yields each argument", async () => {
    expect.assertions(3);

    let args = ["foo", "bar", "baz"];
    let expectedValues = [...args];

    for await (let value of of(...args)) {
      expect(value).toStrictEqual(expectedValues.shift());
    }
  });
}
