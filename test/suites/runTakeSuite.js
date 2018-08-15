import { forEach, from } from "../../src";

export function runTakeSuite(take) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(take([], 1)).toReturnSameAsyncIterator();
  });

  test.each`
    iterableType | createIterableIterator
    ${"sync"}    | ${function*() {}}
    ${"async"}   | ${async function*() {}}
  `(
    "lazily consumes the provided $iterableType iterable",
    async ({ createIterableIterator }) => {
      expect.assertions(2);

      let iterableIterator = createIterableIterator();
      let next = jest.spyOn(iterableIterator, "next");

      let take$ = take(iterableIterator, 1)[Symbol.asyncIterator]();
      expect(next).not.toHaveBeenCalled();

      await take$.next();
      expect(next).toHaveBeenCalled();
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
