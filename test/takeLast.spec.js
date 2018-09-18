import { takeLast } from "../src/takeLast";

import { of } from "../src/of";
import { ArrayLike } from "./helpers/ArrayLike";

test("rejects on non-IterableLike input", async () => {
  expect.assertions(2);
  try {
    await takeLast(null, 1).next();
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
    await takeLast(of("foo"), numToTake).next();
  } catch (error) {
    expect(error).toBeInstanceOf(RangeError);
    expect(error.message).toMatchSnapshot();
  }
});

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
  await expect(_ => takeLast(_, 1)).toLazilyConsumeWrappedAsyncIterable();
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
    for await (let value of takeLast(iterableLike, Number.POSITIVE_INFINITY)) {
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
