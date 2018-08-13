import { takeWhile } from "./takeWhile";

export function take<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  numResults: number
): AsyncIterable<T> {
  return takeWhile(iterable, (_, index): boolean => index! < numResults);
}
