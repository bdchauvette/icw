import { consume } from "../../src/consume";
import { isEven, isEvenAsync } from "../helpers/isEven";

export function runFilterSuite(filter: Function) {
  test("returns an async iterable", async () => {
    expect.assertions(1);
    await expect(filter([1, 2, 3], isEven)).toBeAsyncIterable();
  });

  test.each`
    callbackType | callback
    ${"sync"}    | ${isEven}
    ${"async"}   | ${isEvenAsync}
  `(
    "filters results of input with $callbackType callback",
    async ({ callback }) => {
      expect.assertions(2);
      let input = [1, 2, 3, 4, 5];
      let expectedResults = [2, 4];

      for await (let result of filter(input, callback)) {
        expect(result).toEqual(expectedResults.shift());
      }
    }
  );

  test("provides current result as first argument to callback", async () => {
    expect.assertions(3);

    let mockCallback = jest.fn(isEven);
    await consume(filter([1, 2, 3], mockCallback));

    expect(mockCallback.mock.calls[0][0]).toEqual(1);
    expect(mockCallback.mock.calls[1][0]).toEqual(2);
    expect(mockCallback.mock.calls[2][0]).toEqual(3);
  });

  test("provides current index as second argument to callback", async () => {
    expect.assertions(3);

    let mockCallback = jest.fn(isEven);
    await consume(filter([1, 2, 3], mockCallback));

    expect(mockCallback.mock.calls[0][1]).toEqual(0);
    expect(mockCallback.mock.calls[1][1]).toEqual(1);
    expect(mockCallback.mock.calls[2][1]).toEqual(2);
  });

  test("calls callback with an `undefined` `this`-context by default", async () => {
    expect.assertions(1);
    await consume(filter([1], mockCallback));

    function mockCallback(this: undefined) {
      expect(this).toBeUndefined();
    }
  });

  test("calls callback with the `this`-context provided by the second argument", async () => {
    expect.assertions(1);
    let expectedThis = {};
    await consume(filter([1], mockCallback, expectedThis));

    function mockCallback(this: typeof expectedThis) {
      expect(this).toBe(expectedThis);
    }
  });
}
