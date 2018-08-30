import { of } from "../../src";
import { ArrayLike } from "../helpers/ArrayLike";

export function runWithIndexSuite(withIndex) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(withIndex(of())).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(withIndex(of())).toBeCloseableAsyncIterator();
  });

  test("lazily consumes provided IterableLike input", async () => {
    expect.assertions(1);
    await expect(_ => withIndex(_)).toLazilyConsumeWrappedAsyncIterable();
  });

  test.each`
    inputType          | iterableLike                          | expectedValues
    ${"AsyncIterable"} | ${of("foo", "bar", "baz")}            | ${["foo", "bar", "baz"]}
    ${"Iterable"}      | ${["foo", "bar", "baz"]}              | ${["foo", "bar", "baz"]}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")} | ${["foo", "bar", "baz"]}
    ${"Promise"}       | ${Promise.resolve("foo")}             | ${["foo"]}
  `(
    "returns value from $inputType input as first element in tuple",
    async ({ iterableLike, expectedValues }) => {
      expect.assertions(expectedValues.length);
      for await (let [value] of withIndex(iterableLike)) {
        expect(value).toStrictEqual(expectedValues.shift());
      }
    }
  );

  test.each`
    inputType          | iterableLike                          | expectedIndexes
    ${"AsyncIterable"} | ${of("foo", "bar", "baz")}            | ${[0, 1, 2]}
    ${"Iterable"}      | ${["foo", "bar", "baz"]}              | ${[0, 1, 2]}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")} | ${[0, 1, 2]}
    ${"Promise"}       | ${Promise.resolve("foo")}             | ${[0]}
  `(
    "returns index from $inputType input as second element in tuple",
    async ({ iterableLike, expectedIndexes }) => {
      expect.assertions(expectedIndexes.length);
      for await (let [, index] of withIndex(iterableLike)) {
        expect(index).toStrictEqual(expectedIndexes.shift());
      }
    }
  );
}
