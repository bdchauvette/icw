import { from } from "../../src";

export function runToArraySuite(toArray) {
  test("returns a Promise", async () => {
    expect.assertions(1);
    expect(toArray([])).toBeInstanceOf(Promise);
  });

  test.each`
    iterableType | iteratorSymbol          | iterator
    ${"sync"}    | ${Symbol.iterator}      | ${function*() {}}
    ${"async"}   | ${Symbol.asyncIterator} | ${async function*() {}}
  `(
    "eagerly consumes the provided $iterableType iterable",
    async ({ iteratorSymbol, iterator }) => {
      expect.assertions(1);
      let iterable = { [iteratorSymbol]: jest.fn(iterator) };

      await toArray(iterable);
      expect(iterable[iteratorSymbol]).toHaveBeenCalled();
    }
  );

  test.each`
    iterableType | iterable           | expectedValue
    ${"sync"}    | ${[1, 2, 3]}       | ${[1, 2, 3]}
    ${"async"}   | ${from([1, 2, 3])} | ${[1, 2, 3]}
  `(
    "resolves to an array containing the values from $iterableType iterator",
    async ({ iterable, expectedValue }) => {
      expect.assertions(1);
      expect(await toArray(iterable)).toEqual(expectedValue);
    }
  );

  test.each`
    iterableType | iterable
    ${"sync"}    | ${function*() {}}
    ${"async"}   | ${async function*() {}}
  `(
    "resolves to an empty array if $iterableType iterator yields no values",
    async ({ iterable }) => {
      expect.assertions(1);
      expect(await toArray(iterable())).toEqual([]);
    }
  );
}
