import { intersperse } from "../src/intersperse";

import { of } from "../src/of";
import { ArrayLike } from "./helpers/ArrayLike";

test("returns same async iterator", () => {
  expect.assertions(1);
  expect(intersperse(of())).toReturnSameAsyncIterator();
});

test("returns a closeable iterator", async () => {
  expect.assertions(1);
  await expect(intersperse(of())).toBeCloseableAsyncIterator();
});

test("lazily consumes provided IterableLike input", async () => {
  expect.assertions(1);
  await expect(_ => intersperse(_)).toLazilyConsumeWrappedAsyncIterable();
});

test.each`
  inputType          | iterableLike                          | separator | expectedValues
  ${"AsyncIterable"} | ${of("foo", "bar", "baz")}            | ${"|"}    | ${["foo", "|", "bar", "|", "baz"]}
  ${"Iterable"}      | ${["foo", "bar", "baz"]}              | ${"|"}    | ${["foo", "|", "bar", "|", "baz"]}
  ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")} | ${"|"}    | ${["foo", "|", "bar", "|", "baz"]}
`(
  "adds separator between each yielded value from $inputType input",
  async ({ iterableLike, separator, expectedValues }) => {
    expect.assertions(expectedValues.length);
    for await (let value of intersperse(iterableLike, separator)) {
      expect(value).toStrictEqual(expectedValues.shift());
    }
  }
);

test.each`
  inputType          | iterableLike                          | expectedValues
  ${"AsyncIterable"} | ${of("foo", "bar", "baz")}            | ${["foo", undefined, "bar", undefined, "baz"]}
  ${"Iterable"}      | ${["foo", "bar", "baz"]}              | ${["foo", undefined, "bar", undefined, "baz"]}
  ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")} | ${["foo", undefined, "bar", undefined, "baz"]}
`(
  "uses `undefined` as default separator between each yielded value from $inputType input",
  async ({ iterableLike, separator, expectedValues }) => {
    expect.assertions(expectedValues.length);
    for await (let value of intersperse(iterableLike, separator)) {
      expect(value).toStrictEqual(expectedValues.shift());
    }
  }
);

test.each`
  inputType          | iterableLike              | expectedValues
  ${"AsyncIterable"} | ${of("foo")}              | ${["foo"]}
  ${"Iterable"}      | ${["foo"]}                | ${["foo"]}
  ${"ArrayLike"}     | ${new ArrayLike("foo")}   | ${["foo"]}
  ${"Promise"}       | ${Promise.resolve("foo")} | ${["foo"]}
`(
  "does not add a separator if only one value is yielded from $inputType input",
  async ({ iterableLike, expectedValues }) => {
    expect.assertions(expectedValues.length);
    for await (let value of intersperse(iterableLike)) {
      expect(value).toStrictEqual(expectedValues.shift());
    }
  }
);
