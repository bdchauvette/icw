import { of } from "../../src";
import { ArrayLike } from "../helpers/ArrayLike";

export function runIncludesSuite(includes) {
  test("eagerly consumes wrapped IterableLike input", async () => {
    expect.assertions(1);
    await expect(_ => includes(_)).toEagerlyConsumeWrappedAsyncIterable();
  });

  test.each`
    inputType          | iterableLike                          | targetValue
    ${"AsyncIterable"} | ${of("foo", "bar", "baz")}            | ${"baz"}
    ${"Iterable"}      | ${["foo", "bar", "baz"]}              | ${"baz"}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")} | ${"baz"}
    ${"Promise"}       | ${Promise.resolve("foo")}             | ${"foo"}
  `(
    "returns true when the $inputType input contains the target value",
    async ({ iterableLike, targetValue }) => {
      expect.assertions(1);
      await expect(includes(iterableLike, targetValue)).resolves.toStrictEqual(
        true
      );
    }
  );

  test.each`
    inputType          | iterableLike                          | targetValue
    ${"AsyncIterable"} | ${of("foo", "bar", "baz")}            | ${"qux"}
    ${"Iterable"}      | ${["foo", "bar", "baz"]}              | ${"qux"}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")} | ${"qux"}
    ${"Promise"}       | ${Promise.resolve("foo")}             | ${"qux"}
  `(
    "returns false when the $inputType input does not contain the target value",
    async ({ iterableLike, targetValue }) => {
      expect.assertions(1);
      await expect(includes(iterableLike, targetValue)).resolves.toStrictEqual(
        false
      );
    }
  );

  test.each`
    inputValue           | targetValue          | expectedResult
    ${true}              | ${true}              | ${true}
    ${false}             | ${false}             | ${true}
    ${undefined}         | ${undefined}         | ${true}
    ${null}              | ${null}              | ${true}
    ${0}                 | ${0}                 | ${true}
    ${0}                 | ${-0}                | ${true}
    ${-0}                | ${-0}                | ${true}
    ${"foo"}             | ${"foo"}             | ${true}
    ${undefined}         | ${false}             | ${false}
    ${undefined}         | ${null}              | ${false}
    ${undefined}         | ${0}                 | ${false}
    ${null}              | ${false}             | ${false}
    ${null}              | ${0}                 | ${false}
    ${0}                 | ${false}             | ${false}
    ${""}                | ${false}             | ${false}
    ${""}                | ${0}                 | ${false}
    ${"0"}               | ${0}                 | ${false}
    ${"123"}             | ${123}               | ${false}
    ${[1, 2, 3]}         | ${"1,2,3"}           | ${false}
    ${[]}                | ${[]}                | ${false}
    ${new String("foo")} | ${new String("foo")} | ${false}
    ${new String("foo")} | ${"foo"}             | ${false}
    ${NaN}               | ${0}                 | ${false}
    ${NaN}               | ${"foo"}             | ${false}
    ${NaN}               | ${NaN}               | ${true}
  `(
    "uses SameValueZero comparison: ($inputValue, $targetValue) -> $expectedResult",
    async ({ inputValue, targetValue, expectedResult }) => {
      expect.assertions(1);
      await expect(
        includes(of(inputValue), targetValue)
      ).resolves.toStrictEqual(expectedResult);
    }
  );
}
