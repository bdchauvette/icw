import { IterableLike } from "../IterableLike";
import { isAsyncIterable } from "./isAsyncIterable";
import { isIterable } from "./isIterable";
import { isArrayLike } from "./isArrayLike";
import { isPromise } from "./isPromise";

export function isIterableLike<T>(value: any): value is IterableLike<T> {
  return (
    isAsyncIterable(value) ||
    isIterable(value) ||
    Array.isArray(value) ||
    isArrayLike(value) ||
    isPromise(value)
  );
}
