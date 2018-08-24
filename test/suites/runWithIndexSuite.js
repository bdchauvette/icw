import { of } from "../../src";

export function runWithIndexSuite(withIndex) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(withIndex(of())).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(withIndex(of())).toBeCloseableAsyncIterator();
  });

  test("lazily consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => withIndex(_)).toLazilyConsumeWrappedAsyncIterable();
  });

  test("lazily consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => withIndex(_)).toLazilyConsumeWrappedIterable();
  });

  test("returns result from iterable as first element in tuple", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedResults = ["foo", "bar", "baz"];

    for await (let [result] of withIndex(input)) {
      expect(result).toStrictEqual(expectedResults.shift());
    }
  });

  test("returns index from iterable as second element in tuple", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedIndexes = [0, 1, 2];

    for await (let [, index] of withIndex(input)) {
      expect(index).toStrictEqual(expectedIndexes.shift());
    }
  });
}
