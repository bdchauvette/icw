import { of } from "../../src";

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

      let input = of("foo", "bar", "baz");
      let expectedValues = ["foo", "bar", "baz"];

      for await (let value of from(input)) {
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

      let input = ["foo", "bar", "baz"];
      let expectedValues = [...input];

      for await (let value of from(input)) {
        expect(value).toStrictEqual(expectedValues.shift());
      }
    });
  });

  // eslint-disable-next-line jest/lowercase-name
  describe("Array-like input", () => {
    test("returns same async iterator", () => {
      expect.assertions(1);
      expect(from({ length: 0 })).toReturnSameAsyncIterator();
    });

    test("returns a closeable iterator", async () => {
      expect.assertions(1);
      await expect(from({ length: 0 })).toBeCloseableAsyncIterator();
    });

    test("yields each item from the input", async () => {
      expect.assertions(3);

      let input = { length: 3, 0: "foo", 1: "bar", 2: "baz" };
      let expectedValues = ["foo", "bar", "baz"];

      for await (let value of from(input)) {
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

      for await (let value of from(Promise.resolve("foo"))) {
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
