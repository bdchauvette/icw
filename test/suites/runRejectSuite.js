import { drain, of } from "../../src";
import { isTruthy } from "../helpers/isTruthy";
import { isTruthySync } from "../helpers/isTruthySync";
import { ArrayLike } from "../helpers/ArrayLike";

export function runRejectSuite(reject) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(reject(of(), isTruthy)).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(reject(of(), isTruthy)).toBeCloseableAsyncIterator();
  });

  test("lazily consumes provided IterableLike input", async () => {
    expect.assertions(1);
    await expect(_ =>
      reject(_, isTruthy)
    ).toLazilyConsumeWrappedAsyncIterable();
  });

  test("calls callback with 2 arguments", async () => {
    expect.assertions(1);
    await drain(
      reject(of(true), (...args) => {
        expect(args).toHaveLength(2);
      })
    );
  });

  test("provides current value as first argument to callback", async () => {
    expect.assertions(3);

    let input = of(true, false, true);
    let expectedValues = [true, false, true];

    await drain(
      reject(input, value => {
        expect(value).toStrictEqual(expectedValues.shift());
      })
    );
  });

  test("provides current index as second argument to callback", async () => {
    expect.assertions(3);

    let input = of(true, false, true);
    let expectedIndexes = [0, 1, 2];

    await drain(
      reject(input, (_, index) => {
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

  describe.each`
    callbackType | callback
    ${"async"}   | ${isTruthy}
    ${"sync"}    | ${isTruthySync}
  `("$callbackType callback", ({ callback }) => {
    test.each`
      inputType          | iterableLike                         | expectedValues
      ${"AsyncIterable"} | ${of(false, true, false)}            | ${[false, false]}
      ${"Iterable"}      | ${[false, true, false]}              | ${[false, false]}
      ${"ArrayLike"}     | ${new ArrayLike(false, true, false)} | ${[false, false]}
    `(
      "excludes items from $inputType input that satisfy the predicate",
      async ({ iterableLike, expectedValues }) => {
        expect.assertions(expectedValues.length);
        for await (let value of reject(iterableLike, callback)) {
          expect(value).toStrictEqual(expectedValues.shift());
        }
      }
    );

    test("yields resolved Promise value if it does *not* satisfy the predicate", async () => {
      expect.assertions(1);
      for await (let value of reject(Promise.resolve(false), callback)) {
        expect(value).toStrictEqual(false);
      }
    });

    test("yields no values if resolved Promise value *does* satisfy the predicate", async () => {
      expect.assertions(1);
      let iterator = reject(Promise.resolve(true), callback);
      let result = await iterator.next();
      expect(result.done).toBe(true);
    });
  });
}
