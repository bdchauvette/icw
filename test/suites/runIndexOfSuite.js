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
    ${"AsyncIterable"} | ${of(+0)}
    ${"Iterable"}      | ${[+0]}
    ${"ArrayLike"}     | ${new ArrayLike(+0)}
    ${"Promise"}       | ${Promise.resolve(+0)}
  `("treats -0 and +0 as equal", async ({ iterableLike }) => {
    expect.assertions(1);
    await expect(indexOf(iterableLike, -0)).resolves.toStrictEqual(0);
  });

  test.each`
    inputType          | iterableLike
    ${"AsyncIterable"} | ${of()}
    ${"Iterable"}      | ${[]}
    ${"ArrayLike"}     | ${new ArrayLike()}
    ${"Promise"}       | ${Promise.resolve()}
  `(
    "Returns -1 if $inputType input does not contain the target value",
    async ({ iterableLike }) => {
      expect.assertions(1);
      await expect(
        indexOf(iterableLike, Symbol("missing value"))
      ).resolves.toStrictEqual(-1);
    }
  );

  test.each`
    inputType          | iterableLike
    ${"AsyncIterable"} | ${of(NaN)}
    ${"Iterable"}      | ${[NaN]}
    ${"ArrayLike"}     | ${new ArrayLike(NaN)}
    ${"Promise"}       | ${Promise.resolve(NaN)}
  `(
    "Returns -1 when target value is NaN, but $iterableLike input contains NaN",
    async ({ iterableLike }) => {
      expect.assertions(1);
      await expect(indexOf(iterableLike, NaN)).resolves.toStrictEqual(-1);
    }
  );
}
