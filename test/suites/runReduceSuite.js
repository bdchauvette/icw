import { drain, of } from "../../src";
import { sum } from "../helpers/sum";
import { sumSync } from "../helpers/sumSync";

export function runReduceSuite(reduce) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(reduce(of(), sum)).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(reduce(of(), sum)).toBeCloseableAsyncIterator();
  });

  test("lazily consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => reduce(_, sum)).toLazilyConsumeWrappedAsyncIterable();
  });

  test("lazily consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => reduce(_, sum)).toLazilyConsumeWrappedIterable();
  });

  let eachCallbackType = test.each`
    callbackType | callback
    ${"async"}   | ${sum}
    ${"sync"}    | ${sumSync}
  `;

  eachCallbackType(
    "yields accumulated value of the input with $callbackType callback (implicit initial value)",
    async ({ callback }) => {
      expect.assertions(1);

      for await (let value of reduce(of(1, 2, 3), callback)) {
        expect(value).toStrictEqual(7);
      }
    }
  );

  eachCallbackType(
    "accumulates values from the input with $callbackType callback (explicit initial value)",
    async ({ callback }) => {
      expect.assertions(1);

      for await (let value of reduce(of(1, 2, 3), callback, 0)) {
        expect(value).toStrictEqual(6);
      }
    }
  );

  test("provides three arguments to callback", async () => {
    expect.assertions(1);

    await drain(
      reduce(of(true), (...args) => {
        expect(args).toHaveLength(3);
      })
    );
  });

  test("uses first value as initial accumulator value if no initial value is provided", async () => {
    expect.assertions(1);

    let firstValue = Symbol("first value");
    await drain(reduce(of(firstValue), testCallback));

    function testCallback(accumulator) {
      expect(accumulator).toBe(firstValue);
    }
  });

  test("uses provided initial value as first accumulator value", async () => {
    expect.assertions(1);

    let initialValue = Symbol("initial value");
    await drain(reduce(of("foo"), testCallback, initialValue));

    function testCallback(accumulator) {
      expect(accumulator).toBe(initialValue);
    }
  });

  test("uses `undefined` as initial accumulator value if `undefined` is explicitly provided", async () => {
    expect.assertions(1);

    await drain(reduce(of("foo"), testCallback, undefined));

    function testCallback(accumulator) {
      expect(accumulator).toBeUndefined();
    }
  });

  test("provides current value as second argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedValues = ["foo", "bar", "baz"];

    await drain(
      reduce(input, (_, value) => {
        expect(value).toStrictEqual(expectedValues.shift());
      })
    );
  });

  test("provides current index as third argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedIndexes = [0, 1, 2];

    await drain(
      reduce(input, (_, __, value) => {
        expect(value).toStrictEqual(expectedIndexes.shift());
      })
    );
  });
}
