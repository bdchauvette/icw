import { drain, of } from "../../src";
import { sum } from "../helpers/sum";
import { sumSync } from "../helpers/sumSync";

export function runScanSuite(scan) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(scan(of(), sum)).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(scan(of(), sum)).toBeCloseableAsyncIterator();
  });

  test("lazily consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => scan(_, sum)).toLazilyConsumeWrappedAsyncIterable();
  });

  test("lazily consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => scan(_, sum)).toLazilyConsumeWrappedIterable();
  });

  let eachCallbackType = test.each`
    callbackType | callback
    ${"async"}   | ${sum}
    ${"sync"}    | ${sumSync}
  `;

  eachCallbackType(
    "accumulates values from the input with $callbackType callback (implicit initial value)",
    async ({ callback }) => {
      expect.assertions(3);

      let input = of(1, 2, 3);
      let expectedResults = [2, 4, 7];

      for await (let result of scan(input, callback)) {
        expect(result).toEqual(expectedResults.shift());
      }
    }
  );

  eachCallbackType(
    "accumulates values from the input with $callbackType callback (explicit initial value)",
    async ({ callback }) => {
      expect.assertions(3);

      let input = of(1, 2, 3);
      let expectedResults = [1, 3, 6];

      for await (let result of scan(input, callback, 0)) {
        expect(result).toEqual(expectedResults.shift());
      }
    }
  );

  test("provides three arguments to callback", async () => {
    expect.assertions(1);

    await drain(
      scan(of(true), (...args) => {
        expect(args).toHaveLength(3);
      })
    );
  });

  test("uses first result as initial accumulator accumulator value if no initial value is provided", async () => {
    expect.assertions(1);

    let firstResult = Symbol("first result");
    await drain(scan(of(firstResult), testCallback));

    function testCallback(accumulator) {
      expect(accumulator).toBe(firstResult);
    }
  });

  test("uses provided initial value as first accumulator value", async () => {
    expect.assertions(1);

    let initialValue = Symbol("initial value");
    await drain(scan(of("foo"), testCallback, initialValue));

    function testCallback(accumulator) {
      expect(accumulator).toBe(initialValue);
    }
  });

  test("uses `undefined` as initial accumulator value if `undefined` is explicitly provided", async () => {
    expect.assertions(1);

    await drain(scan(of("foo"), testCallback, undefined));

    function testCallback(accumulator) {
      expect(accumulator).toBeUndefined();
    }
  });

  test("provides current result as second argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedResults = ["foo", "bar", "baz"];

    await drain(
      scan(input, (_, result) => {
        expect(result).toEqual(expectedResults.shift());
      })
    );
  });

  test("provides current index as third argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedIndexes = [0, 1, 2];

    await drain(
      scan(input, (_, __, result) => {
        expect(result).toEqual(expectedIndexes.shift());
      })
    );
  });
}
