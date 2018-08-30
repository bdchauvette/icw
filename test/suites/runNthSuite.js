import { of } from "../../src";
import { ArrayLike } from "../helpers/ArrayLike";

export function runNthSuite(nth) {
  test("eagerly consumes wrapped IterableLike input", async () => {
    expect.assertions(1);
    await expect(_ => nth(_)).toEagerlyConsumeWrappedAsyncIterable();
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
}
