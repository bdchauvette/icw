import { of } from "../../src";

export function runLastSuite(last) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(last(of())).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(last(of())).toBeCloseableAsyncIterator();
  });

  test("lazily consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => last(_)).toLazilyConsumeWrappedAsyncIterable();
  });

  test("lazily consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => last(_)).toLazilyConsumeWrappedIterable();
  });

  test("yields the last value from the input", async () => {
    expect.assertions(1);

    for await (let value of last(of("foo", "bar", "baz"))) {
      expect(value).toStrictEqual("baz");
    }
  });
}
