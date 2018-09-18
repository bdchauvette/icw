import { join } from "../src/join";

import { of } from "../src/of";
import { ArrayLike } from "./helpers/ArrayLike";

test("rejects on non-IterableLike input", async () => {
  expect.assertions(2);
  try {
    await join(null, ",");
  } catch (error) {
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toMatchInlineSnapshot(
      `"Must provide an iterable, async iterable, Array-like value, or a Promise."`
    );
  }
});

test("eagerly consumes wrapped IterableLike input", async () => {
  expect.assertions(1);
  await expect(_ => join(_)).toEagerlyConsumeWrappedAsyncIterable();
});

test.each`
  inputType          | iterableLike                          | separator | expectedValue
  ${"AsyncIterable"} | ${of("foo", "bar", "baz")}            | ${"|"}    | ${"foo|bar|baz"}
  ${"Iterable"}      | ${["foo", "bar", "baz"]}              | ${"|"}    | ${"foo|bar|baz"}
  ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")} | ${"|"}    | ${"foo|bar|baz"}
`(
  "adds separator between each yielded value from $inputType input",
  async ({ iterableLike, separator, expectedValue }) => {
    expect.assertions(1);
    await expect(join(iterableLike, separator)).resolves.toStrictEqual(
      expectedValue
    );
  }
);

test.each`
  inputType          | iterableLike                          | expectedValue
  ${"AsyncIterable"} | ${of("foo", "bar", "baz")}            | ${"foo,bar,baz"}
  ${"Iterable"}      | ${["foo", "bar", "baz"]}              | ${"foo,bar,baz"}
  ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")} | ${"foo,bar,baz"}
`(
  " uses `,` as default separator between each yielded value from $inputType input",
  async ({ iterableLike, expectedValue }) => {
    expect.assertions(1);
    await expect(join(iterableLike)).resolves.toStrictEqual(expectedValue);
  }
);

test.each`
  inputType          | iterableLike              | expectedValue
  ${"AsyncIterable"} | ${of("foo")}              | ${"foo"}
  ${"Iterable"}      | ${["foo"]}                | ${"foo"}
  ${"ArrayLike"}     | ${new ArrayLike("foo")}   | ${"foo"}
  ${"Promise"}       | ${Promise.resolve("foo")} | ${"foo"}
`(
  "does not add a separator if only one value is yielded from $inputType input",
  async ({ iterableLike, expectedValue }) => {
    expect.assertions(1);
    await expect(join(iterableLike)).resolves.toStrictEqual(expectedValue);
  }
);
