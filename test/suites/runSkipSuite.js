import { of } from "../../src";
import { ArrayLike } from "../helpers/ArrayLike";

export function runSkipSuite(skip) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(skip(of(), 1)).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(skip(of(), 1)).toBeCloseableAsyncIterator();
  });

  test("lazily consumes provided IterableLike input", async () => {
    expect.assertions(1);
    await expect(_ => skip(_, 1)).toLazilyConsumeWrappedAsyncIterable();
  });

  test.each`
    inputType          | iterableLike                                 | numToSkip | expectedValues
    ${"AsyncIterable"} | ${of("foo", "bar", "baz", "qux")}            | ${2}      | ${["baz", "qux"]}
    ${"Iterable"}      | ${["foo", "bar", "baz", "qux"]}              | ${2}      | ${["baz", "qux"]}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz", "qux")} | ${2}      | ${["baz", "qux"]}
    ${"Promise"}       | ${Promise.resolve("foo")}                    | ${0}      | ${["foo"]}
  `(
    "yields all values from $inputType input after `numToSkip` values have been skipped",
    async ({ iterableLike, numToSkip, expectedValues }) => {
      expect.assertions(expectedValues.length);
      for await (let value of skip(iterableLike, numToSkip)) {
        expect(value).toStrictEqual(expectedValues.shift());
      }
    }
  );

  test.each`
    inputType          | iterableLike
    ${"AsyncIterable"} | ${of("foo")}
    ${"Iterable"}      | ${["foo"]}
    ${"ArrayLike"}     | ${new ArrayLike("foo")}
    ${"Promise"}       | ${Promise.resolve("foo")}
  `(
    "yields no values if `numToSkip` is larger than the number of items in $inputType input",
    async ({ iterableLike }) => {
      expect.assertions(1);
      let iterator = skip(iterableLike, Number.POSITIVE_INFINITY);
      let result = await iterator.next();
      expect(result.done).toBe(true);
    }
  );
}
