import { concat } from "../src/concat";

import { of } from "../src/of";
import { ArrayLike } from "./helpers/ArrayLike";

test("returns same async iterator", () => {
  expect.assertions(1);
  expect(concat(of())).toReturnSameAsyncIterator();
});

test("returns a closeable iterator", async () => {
  expect.assertions(1);
  await expect(concat(of())).toBeCloseableAsyncIterator();
});

test("lazily consumes provided IterableLike input", async () => {
  expect.assertions(1);
  await expect(_ => concat(_)).toLazilyConsumeWrappedAsyncIterable();
});

test.each`
  inputType          | iterableLike
  ${"AsyncIterable"} | ${of("foo")}
  ${"Iterable"}      | ${["foo"]}
  ${"ArrayLike"}     | ${new ArrayLike("foo")}
  ${"Promise"}       | ${Promise.resolve("foo")}
`("concats provided values to $inputType input", async ({ iterableLike }) => {
  expect.assertions(3);

  let newValues = [of("bar"), of("baz")];
  let expectedValues = ["foo", "bar", "baz"];

  for await (let value of concat(iterableLike, ...newValues)) {
    expect(value).toStrictEqual(expectedValues.shift());
  }
});

test.each`
  inputType          | iterableLike
  ${"AsyncIterable"} | ${of("foo")}
  ${"Iterable"}      | ${["foo"]}
  ${"ArrayLike"}     | ${new ArrayLike("foo")}
  ${"Promise"}       | ${Promise.resolve("foo")}
`(
  "concats non-iterableLike values with $inputType input",
  async ({ iterableLike }) => {
    expect.assertions(3);

    let newValues = [of("bar"), of("baz")];
    let expectedValues = ["foo", "bar", "baz"];

    for await (let value of concat(iterableLike, ...newValues)) {
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
  "treats strings as single values when concatenating to $inputType input",
  async ({ iterableLike }) => {
    expect.assertions(3);

    let newValues = ["bar", "baz"];
    let expectedValues = ["foo", "bar", "baz"];

    for await (let value of concat(iterableLike, ...newValues)) {
      expect(value).toStrictEqual(expectedValues.shift());
    }
  }
);
