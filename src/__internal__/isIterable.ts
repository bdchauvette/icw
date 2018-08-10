import { isFunction } from "./isFunction";

export function isIterable<T>(value: any): value is Iterable<T> {
  return value != null && isFunction(value[Symbol.iterator]);
}
