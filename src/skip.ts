import { skipWhile } from "./skipWhile";

export function skip<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  numResults: number
): AsyncIterableIterator<T> {
  return skipWhile(iterable, (_, index): boolean => index! < numResults);
}
