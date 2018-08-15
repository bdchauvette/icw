import { drain } from "../../src/drain";
import { toAsync } from "../helpers/toAsync";
import { toUpperCase } from "../helpers/toUpperCase";

export function runMapSuite(map) {
  test.each`
    iterableType | createIterableIterator
    ${"sync"}    | ${function*() {}}
    ${"async"}   | ${async function*() {}}
  `(
    "lazily consumes the provided $iterableType iterable",
    async ({ createIterableIterator }) => {
      expect.assertions(2);

      let iterableIterator = createIterableIterator();
      let next = jest.spyOn(iterableIterator, "next");

      let map$ = map(iterableIterator, toUpperCase)[Symbol.asyncIterator]();
      expect(next).not.toHaveBeenCalled();

      await map$.next();
      expect(next).toHaveBeenCalled();
    }
  );

  test.each`
    callbackType | callback
    ${"sync"}    | ${toUpperCase}
    ${"async"}   | ${toAsync(toUpperCase)}
  `(
    "maps each result of input with $callbackType callback",
    async ({ callback }) => {
      expect.assertions(3);
      let input = ["foo", "bar", "baz"];
      let expectedResults = await Promise.all(input.map(callback));

      for await (let result of map(input, callback)) {
        expect(result).toEqual(expectedResults.shift());
      }
    }
  );

  test("provides current result as first argument to callback", async () => {
    expect.assertions(3);

    let mockCallback = jest.fn();
    await drain(map(["foo", "bar", "baz"], mockCallback));

    expect(mockCallback.mock.calls[0][0]).toEqual("foo");
    expect(mockCallback.mock.calls[1][0]).toEqual("bar");
    expect(mockCallback.mock.calls[2][0]).toEqual("baz");
  });

  test("provides current index as second argument to callback", async () => {
    expect.assertions(3);

    let mockCallback = jest.fn();
    await drain(map(["foo", "bar", "baz"], mockCallback));

    expect(mockCallback.mock.calls[0][1]).toEqual(0);
    expect(mockCallback.mock.calls[1][1]).toEqual(1);
    expect(mockCallback.mock.calls[2][1]).toEqual(2);
  });

  test("calls callback with an `undefined` `this`-context by default", async () => {
    expect.assertions(1);
    await drain(map([123], mockCallback));

    function mockCallback() {
      expect(this).toBeUndefined();
    }
  });

  test("calls callback with the `this`-context provided by `thisArg` argument", async () => {
    expect.assertions(1);
    let expectedThis = {};
    await drain(map([123], mockCallback, expectedThis));

    function mockCallback() {
      expect(this).toBe(expectedThis);
    }
  });
}
