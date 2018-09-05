import { of } from "../../src/of";
import { ArrayLike } from "../helpers/ArrayLike";

export function runToArraySuite(toArray) {
  test("eagerly consumes wrapped IterableLike input", async () => {
    expect.assertions(1);
    await expect(_ => toArray(_)).toEagerlyConsumeWrappedAsyncIterable();
  });

  test.each`
    inputType          | iterableLike                          | expectedValue
    ${"AsyncIterable"} | ${of("foo", "bar", "baz")}            | ${["foo", "bar", "baz"]}
    ${"Iterable"}      | ${["foo", "bar", "baz"]}              | ${["foo", "bar", "baz"]}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")} | ${["foo", "bar", "baz"]}
    ${"Promise"}       | ${Promise.resolve("foo")}             | ${["foo"]}
  `(
    "resolves to an array containing the values from $inputType input",
    async ({ iterableLike, expectedValue }) => {
      expect.assertions(1);
      await expect(toArray(iterableLike)).resolves.toStrictEqual(expectedValue);
    }
  );

  test.each`
    inputType          | iterableLike
    ${"AsyncIterable"} | ${of()}
    ${"Iterable"}      | ${[]}
    ${"ArrayLike"}     | ${new ArrayLike()}
  `(
    "resolves to an empty array if $inputType input yields no values",
    async ({ iterableLike }) => {
      expect.assertions(1);
      await expect(toArray(iterableLike)).resolves.toStrictEqual([]);
    }
  );

  test("resolves to `[undefined]` if Promise input resolves to `undefined`", async () => {
    expect.assertions(1);
    await expect(toArray(Promise.resolve())).resolves.toStrictEqual([
      undefined
    ]);
  });
}
