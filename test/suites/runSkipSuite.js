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

  test("yields values from the input after `numToSkip` values have been skipped", async () => {
    expect.assertions(3);

    let input = of(1, 2, 3, 4, 5);
    let numToSkip = 2;
    let expectedValues = [3, 4, 5];

    for await (let value of skip(input, numToSkip)) {
      expect(value).toStrictEqual(expectedValues.shift());
    }
  });
}
