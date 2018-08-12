export function runWithIndexSuite(withIndex) {
  test("returns an async iterable", async () => {
    expect.assertions(1);
    await expect(withIndex([])).toBeAsyncIterable();
  });

  test.each`
    iterableType | iteratorSymbol          | iterator
    ${"sync"}    | ${Symbol.iterator}      | ${function*() {}}
    ${"async"}   | ${Symbol.asyncIterator} | ${async function*() {}}
  `(
    "lazily consumes the provided $iterableType iterable",
    async ({ iteratorSymbol, iterator }) => {
      expect.assertions(2);
      let iterable = { [iteratorSymbol]: jest.fn(iterator) };

      let withIndex$ = withIndex(iterable)[Symbol.asyncIterator]();
      expect(iterable[iteratorSymbol]).not.toHaveBeenCalled();

      await withIndex$.next();
      expect(iterable[iteratorSymbol]).toHaveBeenCalled();
    }
  );

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
