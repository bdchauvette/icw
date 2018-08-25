import { of } from "../../src";

export function runFirstSuite(first) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(first(of())).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(first(of())).toBeCloseableAsyncIterator();
  });

  test("lazily consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => first(_)).toLazilyConsumeWrappedAsyncIterable();
  });

  test("lazily consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => first(_)).toLazilyConsumeWrappedIterable();
  });

  test("yields first value from the provided input", async () => {
    expect.assertions(1);

    for await (let value of first(of(1, 2, 3, 4, 5))) {
      expect(value).toStrictEqual(1);
    }
  });
}
