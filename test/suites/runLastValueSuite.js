import { of } from "../../src";

export function runLastValueSuite(lastValue) {
  test("eagerly consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => lastValue(_)).toEagerlyConsumeWrappedAsyncIterable();
  });

  test("eagerly consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => lastValue(_)).toEagerlyConsumeWrappedIterable();
  });

  test.each`
    iterableType | input                      | expectedValue
    ${"async"}   | ${of("foo", "bar", "baz")} | ${"baz"}
    ${"sync"}    | ${["foo", "bar", "baz"]}   | ${"baz"}
  `(
    "resolves to the nth value from $iterableType iterator",
    async ({ input, expectedValue }) => {
      expect.assertions(1);
      await expect(lastValue(input)).resolves.toStrictEqual(expectedValue);
    }
  );

  test.each`
    iterableType | input                    | expectedValue
    ${"array"}   | ${["foo", "bar", "baz"]} | ${"baz"}
    ${"string"}  | ${"qux"}                 | ${"x"}
  `(
    "uses fast random access for $iterableType",
    async ({ input, expectedValue }) => {
      expect.assertions(2);
      let iterator = input[Symbol.iterator]();
      let next = jest.spyOn(iterator, "next");
      await expect(lastValue(input)).resolves.toStrictEqual(expectedValue);
      expect(next).not.toHaveBeenCalled();
    }
  );

  test.each`
    iterableType | input
    ${"async"}   | ${of()}
    ${"sync"}    | ${[]}
  `(
    "resolves to `undefined` if iterable yields no values",
    async ({ input }) => {
      expect.assertions(1);
      await expect(lastValue(input)).resolves.toBeUndefined();
    }
  );
}
