import { drain } from "../../src/drain";
import { isEven } from "../helpers/isEven";
import { toAsync } from "../helpers/toAsync";

export function runRejectSuite(reject) {
  test("returns an async iterable", async () => {
    expect.assertions(1);
    await expect(reject([1, 2, 3], isEven)).toBeAsyncIterable();
  });

  test("lazily consumes the provided iterable", async () => {
    expect.assertions(2);
    let next = jest.fn(() => ({ done: true }));
    let iterable = { [Symbol.iterator]: () => ({ next }) };

    let reject$ = reject(iterable, isEven);
    expect(next).not.toHaveBeenCalled();

    await drain(reject$);
    expect(next).toHaveBeenCalled();
  });

  test.each`
    callbackType | callback
    ${"sync"}    | ${isEven}
    ${"async"}   | ${toAsync(isEven)}
  `(
    "rejects results of input using $callbackType callback",
    async ({ callback }) => {
      expect.assertions(3);
      let input = [1, 2, 3, 4, 5];
      let expectedResults = [1, 3, 5];

      for await (let result of reject(input, callback)) {
        expect(result).toEqual(expectedResults.shift());
      }
    }
  );

  test("provides current result as first argument to callback", async () => {
    expect.assertions(3);

    let mockCallback = jest.fn(isEven);
    await drain(reject([1, 2, 3], mockCallback));

    expect(mockCallback.mock.calls[0][0]).toEqual(1);
    expect(mockCallback.mock.calls[1][0]).toEqual(2);
    expect(mockCallback.mock.calls[2][0]).toEqual(3);
  });

  test("provides current index as second argument to callback", async () => {
    expect.assertions(3);

    let mockCallback = jest.fn(isEven);
    await drain(reject([1, 2, 3], mockCallback));

    expect(mockCallback.mock.calls[0][1]).toEqual(0);
    expect(mockCallback.mock.calls[1][1]).toEqual(1);
    expect(mockCallback.mock.calls[2][1]).toEqual(2);
  });

  test("calls callback with an `undefined` `this`-context by default", async () => {
    expect.assertions(1);
    await drain(reject([1], mockCallback));

    function mockCallback() {
      expect(this).toBeUndefined();
    }
  });

  test("calls callback with the `this`-context provided by `thisArg` argument", async () => {
    expect.assertions(1);
    let expectedThis = {};
    await drain(reject([1], mockCallback, expectedThis));

    function mockCallback() {
      expect(this).toBe(expectedThis);
    }
  });
}
