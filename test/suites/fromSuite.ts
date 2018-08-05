import { AsyncDelegator } from "../../src/__internal__/AsyncDelegator";

export const fromSuite = (from: Function) => {
  describe("async iterable input", () => {
    test("returns an async iterable", async () => {
      expect.assertions(1);
      await expect(from(new AsyncDelegator([1, 2, 3]))).toBeAsyncIterable();
    });

    test("yields each item from the input", async () => {
      expect.assertions(3);

      let input = new AsyncDelegator([1, 2, 3]);
      let expectedResults = [1, 2, 3];

      for await (let result of from(input)) {
        expect(result).toEqual(expectedResults.shift());
      }
    });
  });

  describe("iterable input", () => {
    test("converts to an async iterable", async () => {
      expect.assertions(1);
      await expect(from([1, 2, 3])).toBeAsyncIterable();
    });

    test("yields each item from the input", async () => {
      expect.assertions(3);

      let input = [1, 2, 3];
      let expectedResults = [...input];

      for await (let result of from(input)) {
        expect(result).toEqual(expectedResults.shift());
      }
    });
  });

  // eslint-disable-next-line jest/lowercase-name
  describe("Array-like input", () => {
    test("converts to an async iterable", async () => {
      expect.assertions(1);
      await expect(from({ length: 0 })).toBeAsyncIterable();
    });

    test("yields each item from the input", async () => {
      expect.assertions(3);

      let input = { length: 3, 0: "foo", 1: "bar", 2: "baz" };
      let expectedResults = ["foo", "bar", "baz"];

      for await (let result of from(input)) {
        expect(result).toEqual(expectedResults.shift());
      }
    });
  });

  // eslint-disable-next-line jest/lowercase-name
  describe("Promise input", () => {
    test("converts to an async iterable", async () => {
      expect.assertions(1);
      await expect(from(Promise.resolve())).toBeAsyncIterable();
    });

    test("yields the resolved value of the promise", async () => {
      expect.assertions(1);

      for await (let result of from(Promise.resolve("foo"))) {
        expect(result).toEqual("foo");
      }
    });
  });
  // eslint-disable-next-line jest/lowercase-name
  describe("invalid input", () => {
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
      // eslint-disable-next-line jest/prefer-inline-snapshots
      expect(() => from(input)).toThrowErrorMatchingSnapshot();
    });
  });
};
