import { isFunction } from "./isFunction";

export const isAsyncIterable = <T>(value: any): value is AsyncIterable<T> =>
  value != null && isFunction(value[Symbol.asyncIterator]);
