import { toAsync } from "../helpers/toAsync";
import { drain, forEach } from "../../src";

export function runSkipWhileSuite(skipWhile) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(skipWhile([], Boolean)).toReturnSameAsyncIterator();
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

      let skipWhile$ = skipWhile(iterableIterator, Boolean)[
        Symbol.asyncIterator
      ]();
      expect(next).not.toHaveBeenCalled();

      await skipWhile$.next();
      expect(next).toHaveBeenCalled();
    }
  );

  test.each`
    callbackType | callback
    ${"sync"}    | ${Boolean}
    ${"async"}   | ${toAsync(Boolean)}
  `(
    "skips results until the provided $callbackType condition is falsy for the first time",
    async ({ callback }) => {
      expect.assertions(1);
      let input = [true, true, true, true, false, false, true];
      let expectedResults = [false, false, true];
      let actualResults = [];

      await forEach(skipWhile(input, callback), result =>
        actualResults.push(result)
      );

      expect(actualResults).toEqual(expectedResults);
    }
  );

  test("provides current result as first argument to callback", async () => {
    expect.assertions(3);

    let input = ["foo", "bar", "baz"];
    let expectedResults = [...input];

    await drain(
      skipWhile(input, result => {
        expect(result).toEqual(expectedResults.shift());
        return true;
      })
    );
  });

  test("provides current index as second argument to callback", async () => {
    expect.assertions(3);

    let input = ["foo", "bar", "baz"];
    let expectedIndexes = [0, 1, 2];

    await drain(
      skipWhile(input, (_, index) => {
        expect(index).toEqual(expectedIndexes.shift());
        return true;
      })
    );
  });

  test("calls callback with an `undefined` `this`-context by default", async () => {
    expect.assertions(1);
    await drain(skipWhile([1], mockCallback));

    function mockCallback() {
      expect(this).toBeUndefined();
    }
  });

  test("calls callback with the `this`-context provided by `thisArg` argument", async () => {
    expect.assertions(1);
    let expectedThis = {};
    await drain(skipWhile([1], mockCallback, expectedThis));

    function mockCallback() {
      expect(this).toBe(expectedThis);
    }
  });
}
