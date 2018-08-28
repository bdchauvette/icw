import { of } from "../../src";

export function runFirstSuite(first) {
  test("eagerly consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => first(_)).toEagerlyConsumeWrappedAsyncIterable();
  });

  test("eagerly consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => first(_)).toEagerlyConsumeWrappedIterable();
  });

  test.each`
    iterableType | input          | expectedValue
    ${"async"}   | ${of(1, 2, 3)} | ${1}
    ${"sync"}    | ${[1, 2, 3]}   | ${1}
  `(
    "resolves to the first value from $iterableType iterator",
    async ({ input, expectedValue }) => {
      expect.assertions(1);
      await expect(first(input)).resolves.toStrictEqual(expectedValue);
    }
  );

  test.each`
    iterableType | input
    ${"async"}   | ${of()}
    ${"sync"}    | ${[]}
  `(
    "resolves to `undefined` if $iterableType iterable yields no values",
    async ({ input }) => {
      expect.assertions(1);
      await expect(first(input)).resolves.toBeUndefined();
    }
  );
}
