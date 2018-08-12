import { noop } from "../helpers/noop";
import { drain, forEach, from } from "../../src";

export function runTapSuite(tap) {
  test("returns an async iterable", async () => {
    expect.assertions(1);
    await expect(tap([], noop)).toBeAsyncIterable();
  });

  test("lazily consumes the provided iterable", async () => {
    expect.assertions(2);
    let next = jest.fn(() => ({ done: true }));

    let iterable = {
      [Symbol.iterator]() {
        return { next };
      }
    };

    let tap$ = tap(iterable, noop)[Symbol.asyncIterator]();
    expect(next).not.toHaveBeenCalled();

    await tap$.next();
    expect(next).toHaveBeenCalled();
  });

  test("lazily consumes the provided async iterable", async () => {
    expect.assertions(2);
    let next = jest.fn(async () => ({ done: true }));

    let iterable = {
      [Symbol.asyncIterator]() {
        return { next };
      }
    };

    let tap$ = tap(iterable, noop)[Symbol.asyncIterator]();
    expect(next).not.toHaveBeenCalled();

    await tap$.next();
    expect(next).toHaveBeenCalled();
  });

  test("yields each result from the provided iterable", async () => {
    expect.assertions(3);
    let input = ["foo", "bar", "baz"];
    let tap$ = tap(input, noop);
    await forEach(tap$, (result, index) => {
      expect(result).toEqual(input[index]);
    });
  });

  test("yields each result from the provided async iterable", async () => {
    expect.assertions(3);
    let input = ["foo", "bar", "baz"];
    let tap$ = tap(from(input), noop);
    await forEach(tap$, (result, index) => {
      expect(result).toEqual(input[index]);
    });
  });

  test("calls callback before yielding the result", async () => {
    expect.assertions(3);
    let callback = jest.fn();
    let tap$ = tap(["foo", "bar", "baz"], callback);

    await forEach(tap$, (_, index) => {
      // If the result were yielded _before_ calling the callback, then the
      // call count would be equal to the index, because the generator would
      // suspend before calling the function.
      expect(callback).toHaveBeenCalledTimes(index + 1);
    });
  });

  test("provides current result as first argument to callback", async () => {
    expect.assertions(3);

    let input = ["foo", "bar", "baz"];
    let expectedArgs = [...input];

    await drain(
      tap(input, result => {
        expect(result).toEqual(expectedArgs.shift());
      })
    );
  });

  test("provides current index as second argument to callback", async () => {
    expect.assertions(3);

    let input = ["foo", "bar", "baz"];
    let expectedIndexes = [0, 1, 2];

    await drain(
      tap(input, (_, index) => {
        expect(index).toEqual(expectedIndexes.shift());
      })
    );
  });

  test("calls callback with an `undefined` `this`-context by default", async () => {
    expect.assertions(1);
    await drain(tap([1], callback));

    function callback() {
      expect(this).toBeUndefined();
    }
  });

  test("calls callback with the `this`-context provided by `thisArg` argument", async () => {
    expect.assertions(1);
    let expectedThis = {};
    await drain(tap([1], callback, expectedThis));

    function callback() {
      expect(this).toBe(expectedThis);
    }
  });
}
