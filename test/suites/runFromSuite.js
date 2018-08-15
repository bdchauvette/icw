export function runFromSuite(from) {
  describe("async iterable input", () => {
    test("yields each item from the input", async () => {
      expect.assertions(3);

      let input = {
        async *[Symbol.asyncIterator]() {
          yield 1;
          yield 2;
          yield 3;
        }
      };

      let expectedResults = [1, 2, 3];

      for await (let result of from(input)) {
        expect(result).toEqual(expectedResults.shift());
      }
    });
  });

  describe("iterable input", () => {
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
    test("yields the resolved value of the promise", async () => {
      expect.assertions(1);

      for await (let result of from(Promise.resolve("foo"))) {
        expect(result).toEqual("foo");
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
