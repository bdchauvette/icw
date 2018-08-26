import { drain, of } from "../../src";
import { isTruthy } from "../helpers/isTruthy";
import { isTruthySync } from "../helpers/isTruthySync";

export function runEverySuite(every) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(every(of(), isTruthy)).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(every(of(), isTruthy)).toBeCloseableAsyncIterator();
  });

  test("lazily consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => every(_, isTruthy)).toLazilyConsumeWrappedAsyncIterable();
  });

  test("lazily consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => every(_, isTruthy)).toLazilyConsumeWrappedIterable();
  });

  describe.each`
    callbackType | callback
    ${"async"}   | ${isTruthy}
    ${"sync"}    | ${isTruthySync}
  `("$callbackType callback", async ({ callback }) => {
    test("returns true when every item of input satisfies the condition", async () => {
      expect.assertions(1);
      for await (let value of every(of(true, true, true), callback)) {
        expect(value).toBe(true);
      }
    });

    test("returns false when every item of input satisfies the condition", async () => {
      expect.assertions(1);
      for await (let value of every(of(true, true, false), callback)) {
        expect(value).toBe(false);
      }
    });
  });

  test("provides two arguments to callback", async () => {
    expect.assertions(1);

    await drain(
      every(of(true), (...args) => {
        expect(args).toHaveLength(2);
      })
    );
  });

  test("provides current value as first argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedValues = ["foo", "bar", "baz"];

    await drain(
      every(input, value => {
        expect(value).toStrictEqual(expectedValues.shift());
        return true;
      })
    );
  });

  test("provides current index as second argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedIndexes = [0, 1, 2];

    await drain(
      every(input, (_, index) => {
        expect(index).toStrictEqual(expectedIndexes.shift());
        return true;
      })
    );
  });

  test("calls callback with an `undefined` `this`-context by default", async () => {
    expect.assertions(1);
    await drain(every(of("foo"), testCallback));

    function testCallback() {
      expect(this).toBeUndefined();
    }
  });

  test("calls callback with the `this`-context provided by `thisArg` argument", async () => {
    expect.assertions(1);
    let expectedThis = {};
    await drain(every(of("foo"), testCallback, expectedThis));

    function testCallback() {
      expect(this).toBe(expectedThis);
    }
  });
}
