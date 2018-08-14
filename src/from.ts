import { isArrayLike } from "./__internal__/isArrayLike";
import { isAsyncIterable } from "./__internal__/isAsyncIterable";
import { isIterable } from "./__internal__/isIterable";
import { isPromise } from "./__internal__/isPromise";

/**
 * Creates an AsyncIterator from an iterable, an Array-like value, or a Promise.
 */
export function from<T>(
  input: AsyncIterable<T> | Iterable<T> | ArrayLike<T> | Promise<T>
): AsyncIterable<T> {
  if (isAsyncIterable(input)) return input;
  if (isIterable(input)) return delegateTo(input);
  if (isArrayLike(input)) return delegateTo(Array.from(input));
  if (isPromise(input)) return fromPromise(input);

  throw new Error(
    "Must provide an iterable, an Array-like value, or a Promise."
  );
}

async function* delegateTo<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): AsyncIterableIterator<T> {
  yield* iterable;
}

async function* fromPromise<T>(input: Promise<T>): AsyncIterableIterator<T> {
  yield input;
}
