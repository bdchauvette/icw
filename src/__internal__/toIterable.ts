import { IterableLike } from "../IterableLike";
import { isArrayLike } from "./isArrayLike";
import { isAsyncIterable } from "./isAsyncIterable";
import { isIterable } from "./isIterable";
import { isPromise } from "./isPromise";

export function toIterable<T>(
  iterableLike: IterableLike<T>
): AsyncIterable<T> | Iterable<T> {
  if (isAsyncIterable<T>(iterableLike)) return iterableLike;
  if (isIterable<T>(iterableLike)) return iterableLike;
  if (isArrayLike<T>(iterableLike)) return Array.from(iterableLike);
  if (isPromise<T>(iterableLike)) return fromPromise(iterableLike);

  throw new TypeError(
    "Must provide an iterable, async iterable, Array-like value, or a Promise."
  );
}

async function* fromPromise<T>(value: Promise<T>): AsyncIterableIterator<T> {
  yield value;
}
