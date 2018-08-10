import { isNumber } from "./isNumber";

export function isArrayLike<T>(value: any): value is ArrayLike<T> {
  return (
    value != null &&
    isNumber(value.length) &&
    value.length >= 0 &&
    value.length <= Number.MAX_SAFE_INTEGER
  );
}
