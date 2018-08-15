import { from } from "../../src";

export function runToPromiseSuite(toPromise) {
  test("returns a Promise", async () => {
    expect.assertions(1);
    expect(toPromise([])).toBeInstanceOf(Promise);
  });

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

      await toPromise(iterableIterator);
      expect(next).toHaveBeenCalled();
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
