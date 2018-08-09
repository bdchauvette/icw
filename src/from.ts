import { isArrayLike } from "./__internal__/isArrayLike";
import { isAsyncIterable } from "./__internal__/isAsyncIterable";
import { isIterable } from "./__internal__/isIterable";
import { isPromise } from "./__internal__/isPromise";
import { AnyIterable } from "./types";

/**
 * Creates an AsyncIterator from an iterable, an Array-like value, or a Promise.
 */
export const from = <T>(
  input: AnyIterable<T> | ArrayLike<T> | Promise<T>
): AsyncIterable<T> => {
  if (isAsyncIterable(input)) return input;
  if (isIterable(input)) return toDelegatingAsyncIterable(input);
  if (isArrayLike(input)) return toDelegatingAsyncIterable(Array.from(input));
  if (isPromise(input)) return fromPromise(input);

  throw new Error(
    "Must provide an iterable, an Array-like value, or a Promise."
  );
};

function toDelegatingAsyncIterable<T>(
  iterable: AnyIterable<T>
): AsyncIterable<T> {
  return {
    async *[Symbol.asyncIterator]() {
      return yield* iterable;
    }
  };
}

function fromPromise<T>(input: Promise<T>): AsyncIterable<T> {
  return {
    async *[Symbol.asyncIterator]() {
      yield input;
    }
  };
}
