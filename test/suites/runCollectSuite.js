import { from } from "../../src";

export function runCollectSuite(collect) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(collect([])).toReturnSameAsyncIterator();
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

      let collect$ = collect(iterableIterator)[Symbol.asyncIterator]();
      expect(next).not.toHaveBeenCalled();

      await collect$.next();
      expect(next).toHaveBeenCalled();
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
