import { forEach, from } from "../../src";

export function runTakeSuite(take) {
  test("returns an async iterable", async () => {
    expect.assertions(1);
    await expect(take([1, 2, 3], Boolean)).toBeAsyncIterable();
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

      let filter$ = take(iterable, Boolean)[Symbol.asyncIterator]();
      expect(iterable[iteratorSymbol]).not.toHaveBeenCalled();

      await filter$.next();
      expect(iterable[iteratorSymbol]).toHaveBeenCalled();
    }
  );

  test.each`
    iterableType | input                                        | numResults | expectedResults
    ${"sync"}    | ${["a", "b", "c", "d", "e", "f", "g"]}       | ${3}       | ${["a", "b", "c"]}
    ${"async"}   | ${from(["a", "b", "c", "d", "e", "f", "g"])} | ${3}       | ${["a", "b", "c"]}
  `(
    "yields results from the provided $iterableType iterable until `numResults` have been yielded",
    async ({ input, numResults, expectedResults }) => {
      expect.assertions(1);
      let actualResults = [];
      await forEach(take(input, numResults), result =>
        actualResults.push(result)
      );
      expect(actualResults).toEqual(expectedResults);
    }
  );
}
