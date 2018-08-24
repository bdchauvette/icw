import { of } from "../../src";
import { noop } from "../helpers/noop";
import { noopSync } from "../helpers/noopSync";

export function runForEachSuite(forEach) {
  test("eagerly consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => forEach(_, noop)).toEagerlyConsumeWrappedAsyncIterable();
  });

  test("eagerly consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => forEach(_, noop)).toEagerlyConsumeWrappedIterable();
  });

  test("runs the provided iterable to completion", async () => {
    expect.assertions(1);

    let iterator = of(1, 2, 3);
    let next = jest.spyOn(iterator, "next");

    await forEach(iterator, noop);
    expect(next).toHaveBeenCalledTimes(4);
  });

  test.each`
    callbackType | callback
    ${"async"}   | ${noop}
    ${"sync"}    | ${noopSync}
  `(
    "calls $callbackType callback once for each result of input",
    async ({ callback }) => {
      expect.assertions(1);
      let mockCallback = jest.fn(callback);
      await forEach(of(1, 2, 3), mockCallback);
      expect(mockCallback).toHaveBeenCalledTimes(3);
    }
  );

  test("provides two arguments to callback", async () => {
    expect.assertions(1);

    await forEach(of(true), (...args) => {
      expect(args).toHaveLength(2);
    });
  });

  test("provides current result as first argument to callback", async () => {
    expect.assertions(3);

    let input = ["foo", "bar", "baz"];
    let expectedArgs = [...input];

    await forEach(input, result => {
      expect(result).toStrictEqual(expectedArgs.shift());
    });
  });

  test("provides current index as second argument to callback", async () => {
    expect.assertions(3);

    let input = ["foo", "bar", "baz"];
    let expectedIndexes = [0, 1, 2];

    await forEach(input, (_, index) => {
      expect(index).toStrictEqual(expectedIndexes.shift());
    });
  });

  test("calls callback with an `undefined` `this`-context by default", async () => {
    expect.assertions(1);
    await forEach(["foo"], testCallback);

    function testCallback() {
      expect(this).toBeUndefined();
    }
  });

  test("calls callback with the `this`-context provided `thisArg` argument", async () => {
    expect.assertions(1);
    let expectedThis = {};
    await forEach(["foo"], testCallback, expectedThis);

    function testCallback() {
      expect(this).toBe(expectedThis);
    }
  });
}
