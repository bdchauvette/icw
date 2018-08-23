import { drain, of } from "../../src";
import { identity } from "../helpers/identity";
import { toUpperCase } from "../helpers/toUpperCase";
import { toUpperCaseSync } from "../helpers/toUpperCaseSync";

export function runMapSuite(map) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(map(of(), identity)).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(map(of(), identity)).toBeCloseableAsyncIterator();
  });

  test("lazily consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => map(_, identity)).toLazilyConsumeWrappedAsyncIterable();
  });

  test("lazily consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => map(_, identity)).toLazilyConsumeWrappedIterable();
  });

  test.each`
    callbackType | callback
    ${"async"}   | ${toUpperCase}
    ${"sync"}    | ${toUpperCaseSync}
  `("maps each result with $callbackType callback", async ({ callback }) => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedResults = ["FOO", "BAR", "BAZ"];

    for await (let result of map(input, callback)) {
      expect(result).toEqual(expectedResults.shift());
    }
  });

  test("provides two arguments to callback", async () => {
    expect.assertions(1);

    await drain(
      map(of(true), (...args) => {
        expect(args).toHaveLength(2);
      })
    );
  });

  test("provides current result as first argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedResults = ["foo", "bar", "baz"];

    await drain(
      map(input, result => {
        expect(result).toEqual(expectedResults.shift());
      })
    );
  });

  test("provides current index as second argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedIndexes = [0, 1, 2];

    await drain(
      map(input, (_, index) => {
        expect(index).toEqual(expectedIndexes.shift());
      })
    );
  });

  test("calls callback with an `undefined` `this`-context by default", async () => {
    expect.assertions(1);
    await drain(map(of("foo"), testCallback));

    function testCallback() {
      expect(this).toBeUndefined();
    }
  });

  test("calls callback with the `this`-context provided by `thisArg` argument", async () => {
    expect.assertions(1);
    let expectedThis = {};
    await drain(map(of("foo"), testCallback, expectedThis));

    function testCallback() {
      expect(this).toBe(expectedThis);
    }
  });
}
