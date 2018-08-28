import { of } from "../../src";

export function runNthSuite(nth) {
  test("eagerly consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => nth(_)).toEagerlyConsumeWrappedAsyncIterable();
  });

  test("eagerly consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => nth(_)).toEagerlyConsumeWrappedIterable();
  });

  test.each`
    iterableType | input                      | index | expectedValue
    ${"async"}   | ${of("foo", "bar", "baz")} | ${1}  | ${"bar"}
    ${"sync"}    | ${["foo", "bar", "baz"]}   | ${1}  | ${"bar"}
  `(
    "resolves to the nth value from $iterableType iterator",
    async ({ input, index, expectedValue }) => {
      expect.assertions(1);
      await expect(nth(input, index)).resolves.toStrictEqual(expectedValue);
    }
  );

  test.each`
    iterableType | input                    | index | expectedValue
    ${"array"}   | ${["foo", "bar", "baz"]} | ${1}  | ${"bar"}
    ${"string"}  | ${"qux"}                 | ${1}  | ${"u"}
  `(
    "uses fast random access for $iterableType",
    async ({ input, index, expectedValue }) => {
      expect.assertions(2);
      let iterator = input[Symbol.iterator]();
      let next = jest.spyOn(iterator, "next");
      await expect(nth(input, index)).resolves.toStrictEqual(expectedValue);
      expect(next).not.toHaveBeenCalled();
    }
  );

  test.each`
    iterableType | input
    ${"async"}   | ${of()}
    ${"sync"}    | ${[]}
  `(
    "resolves to `undefined` if iterable yields no value for provided index",
    async ({ input }) => {
      expect.assertions(1);
      await expect(nth(input, 100)).resolves.toBeUndefined();
    }
  );
}
