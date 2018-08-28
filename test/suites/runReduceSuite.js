import { of } from "../../src";
import { sum } from "../helpers/sum";
import { sumSync } from "../helpers/sumSync";

export function runReduceSuite(reduce) {
  test("eagerly consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => reduce(_, sum)).toEagerlyConsumeWrappedAsyncIterable();
  });

  test("eagerly consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => reduce(_, sum)).toEagerlyConsumeWrappedIterable();
  });

  test("runs the provided iterable to completion", async () => {
    expect.assertions(1);

    let input = of(1, 2, 3);
    let next = jest.spyOn(input, "next");

    await reduce(input, sum);
    expect(next).toHaveBeenCalledTimes(4);
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
      await expect(reduce(of(1, 2, 3), callback)).resolves.toStrictEqual(7);
    }
  );

  eachCallbackType(
    "accumulates values from the input with $callbackType callback (explicit initial value)",
    async ({ callback }) => {
      expect.assertions(1);
      await expect(reduce(of(1, 2, 3), callback, 0)).resolves.toStrictEqual(6);
    }
  );

  test("provides three arguments to callback", async () => {
    expect.assertions(1);

    await reduce(of(true), (...args) => {
      expect(args).toHaveLength(3);
    });
  });

  test("uses first value as initial accumulator value if no initial value is provided", async () => {
    expect.assertions(1);

    let firstValue = Symbol("first value");
    await reduce(of(firstValue), testCallback);

    function testCallback(accumulator) {
      expect(accumulator).toBe(firstValue);
    }
  });

  test("uses provided initial value as first accumulator value", async () => {
    expect.assertions(1);

    let initialValue = Symbol("initial value");
    await reduce(of("foo"), testCallback, initialValue);

    function testCallback(accumulator) {
      expect(accumulator).toBe(initialValue);
    }
  });

  test("uses `undefined` as initial accumulator value if `undefined` is explicitly provided", async () => {
    expect.assertions(1);

    await reduce(of("foo"), testCallback, undefined);

    function testCallback(accumulator) {
      expect(accumulator).toBeUndefined();
    }
  });

  test("provides current value as second argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedValues = ["foo", "bar", "baz"];

    await reduce(input, (_, value) => {
      expect(value).toStrictEqual(expectedValues.shift());
    });
  });

  test("provides current index as third argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedIndexes = [0, 1, 2];

    await reduce(input, (_, __, value) => {
      expect(value).toStrictEqual(expectedIndexes.shift());
    });
  });
}
