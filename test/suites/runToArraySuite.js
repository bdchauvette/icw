import { from } from "../../src";

export function runToArraySuite(toArray) {
  test.each`
    iterableType | createIterableIterator
    ${"sync"}    | ${function*() {}}
    ${"async"}   | ${async function*() {}}
  `(
    "eagerly consumes the provided $iterableType iterable",
    async ({ createIterableIterator }) => {
      expect.assertions(1);

      let iterableIterator = createIterableIterator();
      let next = jest.spyOn(iterableIterator, "next");

      await toArray(iterableIterator);
      expect(next).toHaveBeenCalled();
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
