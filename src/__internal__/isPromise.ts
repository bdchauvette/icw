import { isFunction } from "./isFunction";

export function isPromise<T>(value: any): value is Promise<T> {
  return value != null && isFunction(value.then) && isFunction(value.catch);
}
