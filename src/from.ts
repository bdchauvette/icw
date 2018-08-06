import { isArrayLike } from "./__internal__/isArrayLike";
import { isAsyncIterable } from "./__internal__/isAsyncIterable";
import { isIterable } from "./__internal__/isIterable";
import { isPromise } from "./__internal__/isPromise";
import { DelegatingAsyncIterable } from "./__internal__/DelegatingAsyncIterable";

export type FromInput<T> =
  | AsyncIterable<T>
  | Iterable<T>
  | ArrayLike<T>
  | Promise<T>;

/**
 * Creates an AsyncIterator from an iterable, an Array-like value, or a Promise.
 */
export const from = <T>(input: FromInput<T>): AsyncIterable<T> => {
  if (isAsyncIterable(input)) return input;
  if (isIterable(input)) return new DelegatingAsyncIterable(input);
  if (isArrayLike(input)) return new DelegatingAsyncIterable(Array.from(input));
  if (isPromise(input)) return new DelegatingAsyncIterable([input]);

  throw new Error(
    "Must provide an iterable, an Array-like value, or a Promise."
  );
};
