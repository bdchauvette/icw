import { of } from "../../src";
import { isTruthy } from "../helpers/isTruthy";
import { isTruthySync } from "../helpers/isTruthySync";

export function runSomeSuite(some) {
  test("eagerly consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => some(_, isTruthy)).toEagerlyConsumeWrappedAsyncIterable();
  });

  test("eagerly consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => some(_, isTruthy)).toEagerlyConsumeWrappedIterable();
  });

  test("runs the provided iterable until the predicate returns a truthy value", async () => {
    expect.assertions(1);

    let input = of(false, false, true, true, true);
    let next = jest.spyOn(input, "next");

    await some(input, isTruthy);
    expect(next).toHaveBeenCalledTimes(3);
  });

  test.each`
    callbackType | callback
    ${"async"}   | ${isTruthy}
    ${"sync"}    | ${isTruthySync}
  `("works with $callbackType callback", async ({ callback }) => {
    expect.assertions(1);
    await expect(some(of(false, false, true), callback)).resolves.toBe(true);
  });

  test("provides two arguments to callback", async () => {
    expect.assertions(1);

    await some(of(true), (...args) => {
      expect(args).toHaveLength(2);
    });
  });

  test("provides current value as first argument to callback", async () => {
    expect.assertions(3);

    let input = of(true, false, true);
    let expectedValues = [true, false, true];

    await some(input, value => {
      expect(value).toStrictEqual(expectedValues.shift());
    });
  });

  test("provides current index as second argument to callback", async () => {
    expect.assertions(3);

    let input = of(true, false, true);
    let expectedIndexes = [0, 1, 2];

    await some(input, (_, index) => {
      expect(index).toStrictEqual(expectedIndexes.shift());
    });
  });

  test("calls callback with an `undefined` `this`-context by default", async () => {
    expect.assertions(1);
    await some(of("foo"), testCallback);

    function testCallback() {
      expect(this).toBeUndefined();
    }
  });

  test("calls callback with the `this`-context provided by `thisArg` argument", async () => {
    expect.assertions(1);
    let expectedThis = {};
    await some(of("foo"), testCallback, expectedThis);

    function testCallback() {
      expect(this).toBe(expectedThis);
    }
  });
}
