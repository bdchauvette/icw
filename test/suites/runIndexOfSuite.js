import { of } from "../../src";
import { ArrayLike } from "../helpers/ArrayLike";

export function runIndexOfSuite(indexOf) {
  test("eagerly consumes wrapped IterableLike input", async () => {
    expect.assertions(1);
    await expect(_ => indexOf(_)).toEagerlyConsumeWrappedAsyncIterable();
  });

  test.each`
    inputType          | iterableLike                          | targetValue | expectedIndex
    ${"AsyncIterable"} | ${of("foo", "bar", "baz")}            | ${"bar"}    | ${1}
    ${"Iterable"}      | ${["foo", "bar", "baz"]}              | ${"bar"}    | ${1}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")} | ${"bar"}    | ${1}
    ${"Promise"}       | ${Promise.resolve("foo")}             | ${"foo"}    | ${0}
  `(
    "returns the index of the first target value within the $inputType input",
    async ({ iterableLike, targetValue, expectedIndex }) => {
      await expect(indexOf(iterableLike, targetValue)).resolves.toStrictEqual(
        expectedIndex
      );
    }
  );

  test.each`
    inputType          | iterableLike                                 | targetValue | fromIndex | expectedIndex
    ${"AsyncIterable"} | ${of("foo", "bar", "baz", "foo")}            | ${"foo"}    | ${2}      | ${3}
    ${"Iterable"}      | ${["foo", "bar", "baz", "foo"]}              | ${"foo"}    | ${2}      | ${3}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz", "foo")} | ${"foo"}    | ${2}      | ${3}
    ${"Promise"}       | ${Promise.resolve("foo")}                    | ${"foo"}    | ${2}      | ${-1}
  `(
    "returns the index of the first target value after the fromIndex within the $inputType input",
    async ({ iterableLike, targetValue, fromIndex, expectedIndex }) => {
      await expect(
        indexOf(iterableLike, targetValue, fromIndex)
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
        indexOf(iterableLike, Symbol("missing value"))
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
    ${NaN}               | ${NaN}               | ${-1}
  `(
    "uses StrictEqual comparison: ($inputValue, $targetValue) -> $expectedIndex",
    async ({ inputValue, targetValue, expectedIndex }) => {
      expect.assertions(1);
      await expect(indexOf(of(inputValue), targetValue)).resolves.toStrictEqual(
        expectedIndex
      );
    }
  );
}
