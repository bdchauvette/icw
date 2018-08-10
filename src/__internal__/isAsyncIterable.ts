import { isFunction } from "./isFunction";

export function isAsyncIterable<T>(value: any): value is AsyncIterable<T> {
  return value != null && isFunction(value[Symbol.asyncIterator]);
}
