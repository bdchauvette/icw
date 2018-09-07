import { of } from "../../src/of";
import { ArrayLike } from "../helpers/ArrayLike";

export function runSkipLastSuite(skipLast) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(skipLast(of())).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(skipLast(of())).toBeCloseableAsyncIterator();
  });

  test("lazily consumes provided IterableLike input", async () => {
    expect.assertions(1);
    await expect(_ => skipLast(_)).toLazilyConsumeWrappedAsyncIterable();
  });

  test.each`
    inputType          | iterableLike                                 | numToSkip | expectedValues
    ${"AsyncIterable"} | ${of("foo", "bar", "baz", "qux")}            | ${2}      | ${["foo", "bar"]}
    ${"Iterable"}      | ${["foo", "bar", "baz", "qux"]}              | ${2}      | ${["foo", "bar"]}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz", "qux")} | ${2}      | ${["foo", "bar"]}
  `(
    "yields all but the last `numToSkip` values from $inputType input",
    async ({ iterableLike, numToSkip, expectedValues }) => {
      expect.assertions(expectedValues.length);
      for await (let value of skipLast(iterableLike, numToSkip)) {
        expect(value).toStrictEqual(expectedValues.shift());
      }
    }
  );

  test('yields no values "Promise" input when `numToSkip` is greater than 0', async () => {
    expect.assertions(1);
    let iterator = skipLast(Promise.resolve("foo"), 1);
    let result = await iterator.next();
    expect(result.done).toBe(true);
  });

  test.each`
    inputType          | iterableLike
    ${"AsyncIterable"} | ${of("foo", "bar", "baz")}
    ${"Iterable"}      | ${["foo", "bar", "baz"]}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")}
    ${"Promise"}       | ${Promise.resolve("foo")}
  `(
    "yields no values when `numToSkip` is larger than the number of items in $inputType input",
    async ({ iterableLike }) => {
      expect.assertions(1);
      let iterator = skipLast(iterableLike, Number.POSITIVE_INFINITY);
      let result = await iterator.next();
      expect(result.done).toBe(true);
    }
  );

  test.each`
    inputType          | iterableLike
    ${"AsyncIterable"} | ${of()}
    ${"Iterable"}      | ${[]}
    ${"ArrayLike"}     | ${new ArrayLike()}
  `(
    "yields no values when $inputType input has no items",
    async ({ iterableLike }) => {
      expect.assertions(1);
      let iterator = skipLast(iterableLike, 1);
      let result = await iterator.next();
      expect(result.done).toBe(true);
    }
  );

  test.each`
    inputType          | iterableLike                          | expectedValues
    ${"AsyncIterable"} | ${of("foo", "bar", "baz")}            | ${["foo", "bar", "baz"]}
    ${"Iterable"}      | ${["foo", "bar", "baz"]}              | ${["foo", "bar", "baz"]}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")} | ${["foo", "bar", "baz"]}
    ${"Promise"}       | ${Promise.resolve("foo")}             | ${["foo"]}
  `(
    "yields all values from $inputType input when numToSkip is 0",
    async ({ iterableLike, expectedValues }) => {
      expect.assertions(expectedValues.length);
      for await (let value of skipLast(iterableLike, 0)) {
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
    "yields no values from $inputType input when `numToSkip` is negative",
    async ({ iterableLike, expectedValues }) => {
      expect.assertions(expectedValues.length);
      for await (let value of skipLast(
        iterableLike,
        Number.NEGATIVE_INFINITY
      )) {
        expect(value).toStrictEqual(expectedValues.shift());
      }
    }
  );
}
