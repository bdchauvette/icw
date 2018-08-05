import { isFunction } from "./isFunction";

export const isIterable = <T>(value: any): value is Iterable<T> =>
  value != null && isFunction(value[Symbol.iterator]);
