import { toAsync } from "../helpers/toAsync";
import { drain, forEach } from "../../src";

export function runSkipWhileSuite(skipWhile) {
  test("returns an async iterable", async () => {
    expect.assertions(1);
    await expect(skipWhile([1, 2, 3], Boolean)).toBeAsyncIterable();
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

      let skipWhile$ = skipWhile(iterable, Boolean)[Symbol.asyncIterator]();
      expect(iterable[iteratorSymbol]).not.toHaveBeenCalled();

      await skipWhile$.next();
      expect(iterable[iteratorSymbol]).toHaveBeenCalled();
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
