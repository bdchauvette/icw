import { of } from "../../src";

export function runTakeSuite(take) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(take(of(), 1)).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(take(of(), 1)).toBeCloseableAsyncIterator();
  });

  test("lazily consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => take(_, 1)).toLazilyConsumeWrappedAsyncIterable();
  });

  test("lazily consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => take(_, 1)).toLazilyConsumeWrappedIterable();
  });

  test("yields values from the provided input until `numToTake` values have been yielded", async () => {
    expect.assertions(2);

    let input = of(1, 2, 3, 4, 5);
    let numToTake = 2;
    let expectedValues = [1, 2];

    for await (let value of take(input, numToTake)) {
      expect(value).toStrictEqual(expectedValues.shift());
    }
  });
}
