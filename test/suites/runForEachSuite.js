import { noop } from "../helpers/noop";
import { drain } from "../../src";

export function runForEachSuite(forEach) {
  test("returns a Promise", async () => {
    expect.assertions(1);
    expect(forEach([], noop)).toBeInstanceOf(Promise);
  });

  test("eagerly consumes the provided iterable", async () => {
    expect.assertions(1);
    let next = jest.fn(() => ({ done: true }));
    let iterable = { [Symbol.iterator]: () => ({ next }) };

    await forEach(iterable, noop);
    expect(next).toHaveBeenCalled();
  });

  test("runs the provided iterable to completion", async () => {
    expect.assertions(2);
    let tick = jest.fn();

    let iterations = 3;
    let result = await forEach(
      createConsumableIterable(iterations, tick),
      noop
    );

    expect(result).toBeUndefined();
    expect(tick).toHaveBeenCalledTimes(iterations);
  });

  test("runs the provided async iterable to completion", async () => {
    expect.assertions(2);
    let tick = jest.fn();

    let iterations = 3;
    let result = await forEach(
      createConsumableAsyncIterable(iterations, tick),
      noop
    );

    expect(result).toBeUndefined();
    expect(tick).toHaveBeenCalledTimes(iterations);
  });

  test("provides current result as first argument to callback", async () => {
    expect.assertions(3);

    let input = ["foo", "bar", "baz"];
    let expectedArgs = ["foo", "bar", "baz"];

    await forEach(input, result => {
      expect(result).toEqual(expectedArgs.shift());
    });
  });

  test("provides current index as second argument to callback", async () => {
    expect.assertions(3);

    let expectedIndexes = [0, 1, 2];

    await forEach(["foo", "bar", "baz"], (_, index) => {
      expect(index).toEqual(expectedIndexes.shift());
    });
  });

  test("calls callback with an `undefined` `this`-context by default", async () => {
    expect.assertions(1);
    await forEach([1], function() {
      expect(this).toBeUndefined();
    });
  });

  test("calls callback with the `this`-context provided `thisArg` argument", async () => {
    expect.assertions(1);
    let expectedThis = {};
    await forEach(
      [1],
      function() {
        expect(this).toBe(expectedThis);
      },
      expectedThis
    );
  });
}

function createConsumableIterable(maxIterations, tick) {
  return {
    [Symbol.iterator]() {
      let iteration = 0;
      return {
        next() {
          iteration += 1;
          let result = { value: undefined, done: iteration >= maxIterations };

          tick();
          return result;
        }
      };
    }
  };
}

function createConsumableAsyncIterable(maxIterations, tick) {
  return {
    [Symbol.asyncIterator]() {
      let iteration = 0;
      return {
        async next() {
          iteration += 1;
          let result = { value: undefined, done: iteration >= maxIterations };

          tick();
          return result;
        }
      };
    }
  };
}
