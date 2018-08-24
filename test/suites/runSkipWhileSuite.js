import { drain, of } from "../../src";
import { isTruthy } from "../helpers/isTruthy";
import { isTruthySync } from "../helpers/isTruthySync";

export function runSkipWhileSuite(skipWhile) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(skipWhile(of(), isTruthy)).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(skipWhile(of(), isTruthy)).toBeCloseableAsyncIterator();
  });

  test("lazily consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ =>
      skipWhile(_, isTruthy)
    ).toLazilyConsumeWrappedAsyncIterable();
  });

  test("lazily consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => skipWhile(_, isTruthy)).toLazilyConsumeWrappedIterable();
  });

  test.each`
    callbackType | callback
    ${"async"}   | ${isTruthy}
    ${"sync"}    | ${isTruthySync}
  `(
    "skips results until the provided condition is falsy for the first time",
    async ({ callback }) => {
      expect.assertions(3);

      let input = of(true, true, false, false, true);
      let expectedResults = [false, false, true];

      for await (let result of skipWhile(input, callback)) {
        expect(result).toStrictEqual(expectedResults.shift());
      }
    }
  );

  test("provides two arguments to callback", async () => {
    expect.assertions(1);

    await drain(
      skipWhile(of(true), (...args) => {
        expect(args).toHaveLength(2);
      })
    );
  });

  test("provides current result as first argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedResults = ["foo", "bar", "baz"];

    await drain(
      skipWhile(input, result => {
        expect(result).toStrictEqual(expectedResults.shift());
        return true;
      })
    );
  });

  test("provides current index as second argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedIndexes = [0, 1, 2];

    await drain(
      skipWhile(input, (_, index) => {
        expect(index).toStrictEqual(expectedIndexes.shift());
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
