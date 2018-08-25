import { of } from "../../src";

export function runTailSuite(tail) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(tail(of())).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(tail(of())).toBeCloseableAsyncIterator();
  });

  test("lazily consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => tail(_)).toLazilyConsumeWrappedAsyncIterable();
  });

  test("lazily consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => tail(_)).toLazilyConsumeWrappedIterable();
  });

  test("yields all but the first value from the input", async () => {
    expect.assertions(4);

    let input = of(1, 2, 3, 4, 5);
    let expectedValues = [2, 3, 4, 5];

    for await (let value of tail(input)) {
      expect(value).toStrictEqual(expectedValues.shift());
    }
  });
}
