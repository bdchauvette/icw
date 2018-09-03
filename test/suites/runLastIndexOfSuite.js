import { of } from "../../src";
import { ArrayLike } from "../helpers/ArrayLike";

export function runLastIndexOfSuite(lastIndexOf) {
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
    ${"AsyncIterable"} | ${of(+0)}
    ${"Iterable"}      | ${[+0]}
    ${"ArrayLike"}     | ${new ArrayLike(+0)}
    ${"Promise"}       | ${Promise.resolve(+0)}
  `("treats -0 and +0 as equal", async ({ iterableLike }) => {
    expect.assertions(1);
    await expect(lastIndexOf(iterableLike, -0)).resolves.toStrictEqual(0);
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
        lastIndexOf(iterableLike, Symbol("missing value"))
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
      await expect(lastIndexOf(iterableLike, NaN)).resolves.toStrictEqual(-1);
    }
  );
}
