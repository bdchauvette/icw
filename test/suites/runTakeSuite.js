import { of } from "../../src";
import { ArrayLike } from "../helpers/ArrayLike";

export function runTakeSuite(take) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(take(of(), 1)).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(take(of(), 1)).toBeCloseableAsyncIterator();
  });

  test("lazily consumes provided IterableLike input", async () => {
    expect.assertions(1);
    await expect(_ => take(_, 1)).toLazilyConsumeWrappedAsyncIterable();
  });

  test.each`
    inputType          | iterableLike                                 | numToTake | expectedValues
    ${"AsyncIterable"} | ${of("foo", "bar", "baz", "qux")}            | ${2}      | ${["foo", "bar"]}
    ${"Iterable"}      | ${["foo", "bar", "baz", "qux"]}              | ${2}      | ${["foo", "bar"]}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz", "qux")} | ${2}      | ${["foo", "bar"]}
    ${"Promise"}       | ${Promise.resolve("foo")}                    | ${1}      | ${["foo"]}
  `(
    "yields all values from $inputType input until `numToTake` values have been taken",
    async ({ iterableLike, numToTake, expectedValues }) => {
      expect.assertions(expectedValues.length);
      for await (let value of take(iterableLike, numToTake)) {
        expect(value).toStrictEqual(expectedValues.shift());
      }
    }
  );

  test.each`
    inputType          | iterableLike                          | expectedValues
    ${"AsyncIterable"} | ${of("foo", "bar", "baz")}            | ${["foo", "bar", "baz"]}
    ${"Iterable"}      | ${["foo", "bar", "baz"]}              | ${["foo", "bar", "baz"]}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")} | ${["foo", "bar", "baz"]}
    ${"Promise"}       | ${Promise.resolve("foo")}             | ${["foo"]}
  `(
    "yields all values if `numToTake` is larger than the number of items in $inputType input",
    async ({ iterableLike, expectedValues }) => {
      expect.assertions(expectedValues.length);
      for await (let value of take(iterableLike, Number.POSITIVE_INFINITY)) {
        expect(value).toStrictEqual(expectedValues.shift());
      }
    }
  );
}
