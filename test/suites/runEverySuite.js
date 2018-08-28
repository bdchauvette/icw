import { of } from "../../src";
import { isTruthy } from "../helpers/isTruthy";
import { isTruthySync } from "../helpers/isTruthySync";

export function runEverySuite(every) {
  test("eagerly consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ =>
      every(_, isTruthy)
    ).toEagerlyConsumeWrappedAsyncIterable();
  });

  test("eagerly consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => every(_, isTruthy)).toEagerlyConsumeWrappedIterable();
  });

  test("runs the provided iterable to completion", async () => {
    expect.assertions(1);

    let input = of(1, 2, 3);
    let next = jest.spyOn(input, "next");

    await every(input, isTruthy);
    expect(next).toHaveBeenCalledTimes(4);
  });

  describe.each`
    callbackType | callback
    ${"async"}   | ${isTruthy}
    ${"sync"}    | ${isTruthySync}
  `("$callbackType callback", async ({ callback }) => {
    test("returns true when every item of input satisfies the condition", async () => {
      expect.assertions(1);
      await expect(every(of(true, true, true), callback)).resolves.toBe(true);
    });

    test("returns false when every item of input satisfies the condition", async () => {
      expect.assertions(1);
      await expect(every(of(true, true, false), callback)).resolves.toBe(false);
    });
  });

  test("provides two arguments to callback", async () => {
    expect.assertions(1);

    await every(of(true), (...args) => {
      expect(args).toHaveLength(2);
    });
  });

  test("provides current value as first argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedValues = ["foo", "bar", "baz"];

    await every(input, value => {
      expect(value).toStrictEqual(expectedValues.shift());
      return true;
    });
  });

  test("provides current index as second argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedIndexes = [0, 1, 2];

    await every(input, (_, index) => {
      expect(index).toStrictEqual(expectedIndexes.shift());
      return true;
    });
  });

  test("calls callback with an `undefined` `this`-context by default", async () => {
    expect.assertions(1);
    await every(of("foo"), testCallback);

    function testCallback() {
      expect(this).toBeUndefined();
    }
  });

  test("calls callback with the `this`-context provided by `thisArg` argument", async () => {
    expect.assertions(1);
    let expectedThis = {};
    await every(of("foo"), testCallback, expectedThis);

    function testCallback() {
      expect(this).toBe(expectedThis);
    }
  });
}
