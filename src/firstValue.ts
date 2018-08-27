import { nthValue } from "./nthValue";

export function firstValue<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): Promise<T | undefined> {
  return nthValue(iterable, 0);
}
