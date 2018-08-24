import { of } from "../../src";

export function runToArraySuite(toArray) {
  test("eagerly consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => toArray(_)).toEagerlyConsumeWrappedAsyncIterable();
  });

  test("eagerly consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => toArray(_)).toEagerlyConsumeWrappedIterable();
  });

  test.each`
    iterableType | input          | expectedValue
    ${"async"}   | ${of(1, 2, 3)} | ${[1, 2, 3]}
    ${"sync"}    | ${[1, 2, 3]}   | ${[1, 2, 3]}
  `(
    "resolves to an array containing the values from $iterableType iterator",
    async ({ input, expectedValue }) => {
      expect.assertions(1);
      expect(await toArray(input)).toStrictEqual(expectedValue);
    }
  );

  test.each`
    iterableType | input
    ${"async"}   | ${of()}
    ${"sync"}    | ${[]}
  `(
    "resolves to an empty array if $iterableType iterator yields no values",
    async ({ input }) => {
      expect.assertions(1);
      expect(await toArray(input)).toStrictEqual([]);
    }
  );
}
