import { take } from "../src/take";

import { of } from "../src/of";
import { ArrayLike } from "./helpers/ArrayLike";

test("rejects on non-IterableLike input", async () => {
  expect.assertions(2);
  try {
    await take(null, 1).next();
  } catch (error) {
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toMatchInlineSnapshot(
      `"Must provide an iterable, async iterable, Array-like value, or a Promise."`
    );
  }
});

test.each`
  description      | numToTake
  ${"null"}        | ${null}
  ${"undefined"}   | ${undefined}
  ${"non-numeric"} | ${"-1"}
  ${"< 0"}         | ${-1}
`("rejects when targetIndex is $description", async ({ numToTake }) => {
  expect.assertions(2);
  try {
    await take(of("foo"), numToTake).next();
  } catch (error) {
    expect(error).toBeInstanceOf(RangeError);
    expect(error.message).toMatchSnapshot();
  }
});

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
