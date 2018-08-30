import { isArrayLike } from "./__internal__/isArrayLike";
import { isAsyncIterable } from "./__internal__/isAsyncIterable";
import { isIterable } from "./__internal__/isIterable";
import { isPromise } from "./__internal__/isPromise";
import { IterableLike } from "./IterableLike";

export function from<T>(
  iterableLike: IterableLike<T>
): AsyncIterableIterator<T> {
  if (isAsyncIterable<T>(iterableLike)) return delegateTo(iterableLike);
  if (isIterable(iterableLike)) return delegateTo(iterableLike);
  if (isArrayLike(iterableLike)) return delegateTo(Array.from(iterableLike));
  if (isPromise(iterableLike)) return fromPromise(iterableLike);

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
