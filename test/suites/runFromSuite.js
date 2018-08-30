import { of } from "../../src";
import { ArrayLike } from "../helpers/ArrayLike";

export function runFromSuite(from) {
  describe("async iterable input", () => {
    test("returns same async iterator", () => {
      expect.assertions(1);
      expect(from(of())).toReturnSameAsyncIterator();
    });

    test("returns a closeable iterator", async () => {
      expect.assertions(1);
      await expect(from(of())).toBeCloseableAsyncIterator();
    });

    test("yields each value from the input", async () => {
      expect.assertions(3);

      let asyncIterable = of("foo", "bar", "baz");
      let expectedValues = ["foo", "bar", "baz"];

      for await (let value of from(asyncIterable)) {
        expect(value).toStrictEqual(expectedValues.shift());
      }
    });
  });

  describe("iterable input", () => {
    test("returns same async iterator", () => {
      expect.assertions(1);
      expect(from([])).toReturnSameAsyncIterator();
    });

    test("returns a closeable iterator", async () => {
      expect.assertions(1);
      await expect(from([])).toBeCloseableAsyncIterator();
    });

    test("yields each item from the input", async () => {
      expect.assertions(3);

      let iterable = ["foo", "bar", "baz"];
      let expectedValues = [...iterable];

      for await (let value of from(iterable)) {
        expect(value).toStrictEqual(expectedValues.shift());
      }
    });
  });

  // eslint-disable-next-line jest/lowercase-name
  describe("Array-like input", () => {
    test("returns same async iterator", () => {
      expect.assertions(1);
      expect(from(new ArrayLike())).toReturnSameAsyncIterator();
    });

    test("returns a closeable iterator", async () => {
      expect.assertions(1);
      await expect(from(new ArrayLike())).toBeCloseableAsyncIterator();
    });

    test("yields each item from the input", async () => {
      expect.assertions(3);

      let arrayLike = new ArrayLike("foo", "bar", "baz");
      let expectedValues = ["foo", "bar", "baz"];

      for await (let value of from(arrayLike)) {
        expect(value).toStrictEqual(expectedValues.shift());
      }
    });
  });

  // eslint-disable-next-line jest/lowercase-name
  describe("Promise input", () => {
    test("returns same async iterator", () => {
      expect.assertions(1);
      expect(from(Promise.resolve())).toReturnSameAsyncIterator();
    });

    test("returns a closeable iterator", async () => {
      expect.assertions(1);
      await expect(from(Promise.resolve())).toBeCloseableAsyncIterator();
    });

    test("yields the resolved value of the promise", async () => {
      expect.assertions(1);
      let promise = Promise.resolve("foo");
      for await (let value of from(promise)) {
        expect(value).toStrictEqual("foo");
      }
    });
  });

  test.each`
    inputType                               | input
    ${"Array-like with negative index"}     | ${{ length: -1 }}
    ${"Array-like with too large an index"} | ${{ length: Number.MAX_SAFE_INTEGER + 1 }}
    ${"non-iterable object"}                | ${{}}
    ${"number"}                             | ${123}
    ${"Symbol"}                             | ${Symbol.asyncIterator}
    ${true}                                 | ${true}
    ${false}                                | ${true}
    ${null}                                 | ${null}
    ${undefined}                            | ${undefined}
  `("throws an error when input is $inputType", ({ input }) => {
    expect.assertions(1);
    expect(() => from(input)).toThrowErrorMatchingSnapshot();
  });
}
