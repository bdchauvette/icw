import { from } from "../../src";

export function runToPromiseSuite(toPromise) {
  test("returns a Promise", async () => {
    expect.assertions(1);
    expect(toPromise([])).toBeInstanceOf(Promise);
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

      await toPromise(iterable);
      expect(iterable[iteratorSymbol]).toHaveBeenCalled();
    }
  );

  test.each`
    iterableType | iterable           | expectedValue
    ${"sync"}    | ${[1, 2, 3]}       | ${1}
    ${"async"}   | ${from([1, 2, 3])} | ${1}
  `(
    "resolves to the first value from $iterableType iterator",
    async ({ iterable, expectedValue }) => {
      expect.assertions(1);
      expect(await toPromise(iterable)).toEqual(expectedValue);
    }
  );

  test.each`
    iterableType | iterable
    ${"sync"}    | ${function*() {}}
    ${"async"}   | ${async function*() {}}
  `(
    "resolves to `undefined` if $iterableType iterable yields no values",
    async ({ iterable }) => {
      expect.assertions(1);
      expect(await toPromise(iterable())).toBeUndefined();
    }
  );
}
