import { lastIndexOf } from "../src/lastIndexOf";

import { of } from "../src/of";
import { ArrayLike } from "./helpers/ArrayLike";

test("rejects on non-IterableLike input", async () => {
  expect.assertions(2);
  try {
    await lastIndexOf(null);
  } catch (error) {
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toMatchInlineSnapshot(
      `"Must provide an iterable, async iterable, Array-like value, or a Promise."`
    );
  }
});

test("eagerly consumes wrapped IterableLike input", async () => {
  expect.assertions(1);
  await expect(_ => lastIndexOf(_)).toEagerlyConsumeWrappedAsyncIterable();
});

test.each`
  inputType          | iterableLike                          | expectedIndex
  ${"AsyncIterable"} | ${of("foo", "foo", "foo")}            | ${2}
  ${"Iterable"}      | ${["foo", "foo", "foo"]}              | ${2}
  ${"ArrayLike"}     | ${new ArrayLike("foo", "foo", "foo")} | ${2}
  ${"Promise"}       | ${Promise.resolve("foo")}             | ${0}
`(
  "returns the last index of the first target value within the $inputType input",
  async ({ iterableLike, expectedIndex }) => {
    await expect(lastIndexOf(iterableLike, "foo")).resolves.toStrictEqual(
      expectedIndex
    );
  }
);

test.each`
  inputType          | iterableLike                          | fromIndex | expectedIndex
  ${"AsyncIterable"} | ${of("foo", "foo", "foo")}            | ${1}      | ${2}
  ${"Iterable"}      | ${["foo", "foo", "foo"]}              | ${1}      | ${2}
  ${"ArrayLike"}     | ${new ArrayLike("foo", "foo", "foo")} | ${1}      | ${2}
  ${"Promise"}       | ${Promise.resolve("foo")}             | ${1}      | ${-1}
`(
  "returns the last index of the first target value after the fromIndex within the $inputType input",
  async ({ iterableLike, fromIndex, expectedIndex }) => {
    await expect(
      lastIndexOf(iterableLike, "foo", fromIndex)
    ).resolves.toStrictEqual(expectedIndex);
  }
);

test.each`
  inputType          | iterableLike
  ${"AsyncIterable"} | ${of()}
  ${"Iterable"}      | ${[]}
  ${"ArrayLike"}     | ${new ArrayLike()}
  ${"Promise"}       | ${Promise.resolve()}
`(
  "returns -1 if $inputType input does not contain the target value",
  async ({ iterableLike }) => {
    expect.assertions(1);
    await expect(
      lastIndexOf(iterableLike, Symbol("missing value"))
    ).resolves.toStrictEqual(-1);
  }
);

test.each`
  inputValue           | targetValue          | expectedIndex
  ${true}              | ${true}              | ${0}
  ${false}             | ${false}             | ${0}
  ${undefined}         | ${undefined}         | ${0}
  ${null}              | ${null}              | ${0}
  ${0}                 | ${0}                 | ${0}
  ${0}                 | ${-0}                | ${0}
  ${-0}                | ${-0}                | ${0}
  ${"foo"}             | ${"foo"}             | ${0}
  ${undefined}         | ${false}             | ${-1}
  ${undefined}         | ${null}              | ${-1}
  ${undefined}         | ${0}                 | ${-1}
  ${null}              | ${false}             | ${-1}
  ${null}              | ${0}                 | ${-1}
  ${0}                 | ${false}             | ${-1}
  ${""}                | ${false}             | ${-1}
  ${""}                | ${0}                 | ${-1}
  ${"0"}               | ${0}                 | ${-1}
  ${"123"}             | ${123}               | ${-1}
  ${[1, 2, 3]}         | ${"1,2,3"}           | ${-1}
  ${[]}                | ${[]}                | ${-1}
  ${new String("foo")} | ${new String("foo")} | ${-1}
  ${new String("foo")} | ${"foo"}             | ${-1}
  ${NaN}               | ${0}                 | ${-1}
  ${NaN}               | ${"foo"}             | ${-1}
  ${NaN}               | ${NaN}               | ${0}
`(
  "uses StrictEqual comparison: ($inputValue, $targetValue) -> $expectedIndex",
  async ({ inputValue, targetValue, expectedIndex }) => {
    expect.assertions(1);
    await expect(
      lastIndexOf(of(inputValue), targetValue)
    ).resolves.toStrictEqual(expectedIndex);
  }
);
