import { nth } from "../src/nth";

import { of } from "../src/of";
import { ArrayLike } from "./helpers/ArrayLike";

test("rejects on non-IterableLike input", async () => {
  expect.assertions(2);
  try {
    await nth(null, 0);
  } catch (error) {
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toMatchInlineSnapshot(
      `"Must provide an iterable, async iterable, Array-like value, or a Promise."`
    );
  }
});

test.each`
  description      | targetIndex
  ${"null"}        | ${null}
  ${"undefined"}   | ${undefined}
  ${"non-numeric"} | ${"-1"}
  ${"< 0"}         | ${-1}
`("rejects when targetIndex is $description", async ({ targetIndex }) => {
  expect.assertions(2);
  try {
    await nth(of("foo"), targetIndex);
  } catch (error) {
    expect(error).toBeInstanceOf(RangeError);
    expect(error.message).toMatchSnapshot();
  }
});

test("eagerly consumes wrapped IterableLike input", async () => {
  expect.assertions(1);
  await expect(_ => nth(_, 1)).toEagerlyConsumeWrappedAsyncIterable();
});

test.each`
  inputType          | iterableLike                          | index | expectedValue
  ${"AsyncIterable"} | ${of("foo", "bar", "baz")}            | ${1}  | ${"bar"}
  ${"Iterable"}      | ${["foo", "bar", "baz"]}              | ${1}  | ${"bar"}
  ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")} | ${1}  | ${"bar"}
  ${"Promise"}       | ${Promise.resolve("foo")}             | ${0}  | ${"foo"}
`(
  "resolves to the nth value from $inputType input",
  async ({ iterableLike, index, expectedValue }) => {
    expect.assertions(1);
    await expect(nth(iterableLike, index)).resolves.toStrictEqual(
      expectedValue
    );
  }
);

test.each`
  inputType          | iterableLike
  ${"AsyncIterable"} | ${of("foo", "bar", "baz")}
  ${"Iterable"}      | ${["foo", "bar", "baz"]}
  ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")}
  ${"Promise"}       | ${Promise.resolve("foo")}
`(
  "resolves to undefined if $inputType input does not have an nth value",
  async ({ iterableLike }) => {
    expect.assertions(1);
    await expect(
      nth(iterableLike, Number.MAX_SAFE_INTEGER)
    ).resolves.toBeUndefined();
  }
);
