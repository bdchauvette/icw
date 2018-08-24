import { of } from "../../src";

export function runSkipSuite(skip) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(skip(of(), 1)).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(skip(of(), 1)).toBeCloseableAsyncIterator();
  });

  test("lazily consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => skip(_, 1)).toLazilyConsumeWrappedAsyncIterable();
  });

  test("lazily consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => skip(_, 1)).toLazilyConsumeWrappedIterable();
  });

  test("yields results from the provided iterable after `skipCount` results have been skipped", async () => {
    expect.assertions(3);

    let input = of(1, 2, 3, 4, 5);
    let skipCount = 2;
    let expectedResults = [3, 4, 5];

    for await (let result of skip(input, skipCount)) {
      expect(result).toStrictEqual(expectedResults.shift());
    }
  });
}
