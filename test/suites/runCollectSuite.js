import { from } from "../../src";

export function runCollectSuite(collect) {
  test("returns an async iterable", async () => {
    expect.assertions(1);
    await expect(collect([])).toBeAsyncIterable();
  });

  test.each`
    iterableType | iteratorSymbol          | iterator
    ${"sync"}    | ${Symbol.iterator}      | ${function*() {}}
    ${"async"}   | ${Symbol.asyncIterator} | ${async function*() {}}
  `(
    "lazily consumes the provided $iterableType iterable",
    async ({ iteratorSymbol, iterator }) => {
      expect.assertions(2);
      let iterable = { [iteratorSymbol]: jest.fn(iterator) };

      let collect$ = collect(iterable)[Symbol.asyncIterator]();
      expect(iterable[iteratorSymbol]).not.toHaveBeenCalled();

      await collect$.next();
      expect(iterable[iteratorSymbol]).toHaveBeenCalled();
    }
  );

  test.each`
    iterableType | iterable           | expectedValue
    ${"sync"}    | ${[1, 2, 3]}       | ${[1, 2, 3]}
    ${"async"}   | ${from([1, 2, 3])} | ${[1, 2, 3]}
  `(
    "yields all elements of $iterableType iterable as a single array",
    async ({ iterable, expectedValue }) => {
      expect.assertions(1);
      for await (let result of collect(iterable)) {
        expect(result).toEqual(expectedValue);
      }
    }
  );

  test.each`
    iterableType | iterable
    ${"sync"}    | ${function*() {}}
    ${"async"}   | ${async function*() {}}
  `(
    "yields an empty array if $iterableType iterator yields no values",
    async ({ iterable }) => {
      expect.assertions(1);
      for await (let result of collect(iterable())) {
        expect(result).toEqual([]);
      }
    }
  );
}
