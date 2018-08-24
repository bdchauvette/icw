import { drain, of } from "../../src";
import { isTruthy } from "../helpers/isTruthy";
import { isTruthySync } from "../helpers/isTruthySync";

export function runRejectSuite(reject) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(reject(of(), isTruthy)).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(reject(of(), isTruthy)).toBeCloseableAsyncIterator();
  });

  test("lazily consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ =>
      reject(_, isTruthy)
    ).toLazilyConsumeWrappedAsyncIterable();
  });

  test("lazily consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => reject(_, isTruthy)).toLazilyConsumeWrappedIterable();
  });

  test.each`
    callbackType | callback
    ${"async"}   | ${isTruthy}
    ${"sync"}    | ${isTruthySync}
  `(
    "rejects values when using $callbackType callback",
    async ({ callback }) => {
      expect.assertions(2);

      let iterable = of(true, false, true, false);
      let expectedResults = [false, false];

      for await (let result of reject(iterable, callback)) {
        expect(result).toStrictEqual(expectedResults.shift());
      }
    }
  );

  test("provides two arguments to callback", async () => {
    expect.assertions(1);

    await drain(
      reject(of(true), (...args) => {
        expect(args).toHaveLength(2);
      })
    );
  });

  test("provides current result as first argument to callback", async () => {
    expect.assertions(3);

    let iterable = of(true, false, true);
    let expectedResults = [true, false, true];

    await drain(
      reject(iterable, result => {
        expect(result).toStrictEqual(expectedResults.shift());
      })
    );
  });

  test("provides current index as second argument to callback", async () => {
    expect.assertions(3);

    let iterable = of(true, false, true);
    let expectedIndexes = [0, 1, 2];

    await drain(
      reject(iterable, (_, index) => {
        expect(index).toStrictEqual(expectedIndexes.shift());
      })
    );
  });

  test("calls callback with an `undefined` `this`-context by default", async () => {
    expect.assertions(1);
    await drain(reject(of("foo"), testCallback));

    function testCallback() {
      expect(this).toBeUndefined();
    }
  });

  test("calls callback with the `this`-context provided by `thisArg` argument", async () => {
    expect.assertions(1);
    let expectedThis = {};
    await drain(reject(of("foo"), testCallback, expectedThis));

    function testCallback() {
      expect(this).toBe(expectedThis);
    }
  });
}
