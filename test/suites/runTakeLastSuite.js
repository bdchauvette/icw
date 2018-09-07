import { of } from "../../src/of";
import { ArrayLike } from "../helpers/ArrayLike";

export function runTakeLastSuite(takeLast) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(takeLast(of())).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(takeLast(of())).toBeCloseableAsyncIterator();
  });

  test("lazily consumes provided IterableLike input", async () => {
    expect.assertions(1);
    await expect(_ => takeLast(_)).toLazilyConsumeWrappedAsyncIterable();
  });

  test.each`
    inputType          | iterableLike                          | numToTake | expectedValues
    ${"AsyncIterable"} | ${of("foo", "bar", "baz")}            | ${2}      | ${["bar", "baz"]}
    ${"Iterable"}      | ${["foo", "bar", "baz"]}              | ${2}      | ${["bar", "baz"]}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")} | ${2}      | ${["bar", "baz"]}
  `(
    "yields only the last `numToTake` values from $inputType input",
    async ({ iterableLike, numToTake, expectedValues }) => {
      expect.assertions(expectedValues.length);
      for await (let value of takeLast(iterableLike, numToTake)) {
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
    "yields all values when `numToTake` is larger than the number of items in $inputType input",
    async ({ iterableLike, expectedValues }) => {
      expect.assertions(expectedValues.length);
      for await (let value of takeLast(
        iterableLike,
        Number.POSITIVE_INFINITY
      )) {
        expect(value).toStrictEqual(expectedValues.shift());
      }
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
      let iterator = takeLast(iterableLike, 1);
      let result = await iterator.next();
      expect(result.done).toBe(true);
    }
  );

  test.each`
    inputType          | iterableLike
    ${"AsyncIterable"} | ${of("foo", "bar", "baz")}
    ${"Iterable"}      | ${["foo", "bar", "baz"]}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")}
    ${"Promise"}       | ${Promise.resolve("foo")}
  `(
    "yields no values from $inputType input when numToTake is 0",
    async ({ iterableLike }) => {
      expect.assertions(1);
      let iterator = takeLast(iterableLike, 0);
      let result = await iterator.next();
      expect(result.done).toBe(true);
    }
  );

  test.each`
    inputType          | iterableLike
    ${"AsyncIterable"} | ${of("foo", "bar", "baz")}
    ${"Iterable"}      | ${["foo", "bar", "baz"]}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")}
    ${"Promise"}       | ${Promise.resolve("foo")}
  `(
    "yields no values from $inputType input when `numToTake` is negative",
    async ({ iterableLike }) => {
      expect.assertions(1);
      let iterator = takeLast(iterableLike, Number.NEGATIVE_INFINITY);
      let result = await iterator.next();
      expect(result.done).toBe(true);
    }
  );
}
