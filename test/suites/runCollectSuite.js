import { of } from "../../src";

export function runCollectSuite(collect) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(collect(of())).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(collect(of())).toBeCloseableAsyncIterator();
  });

  test("lazily consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => collect(_)).toLazilyConsumeWrappedAsyncIterable();
  });

  test("lazily consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => collect(_)).toLazilyConsumeWrappedIterable();
  });

  test("yields all elements of iterable as a single array", async () => {
    expect.assertions(1);
    for await (let result of collect(of(1, 2, 3))) {
      expect(result).toStrictEqual([1, 2, 3]);
    }
  });

  test("yields an empty array if iterable yields no values", async () => {
    expect.assertions(1);
    for await (let result of collect(of())) {
      expect(result).toStrictEqual([]);
    }
  });
}
