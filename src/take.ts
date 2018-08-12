import { takeWhile } from "./takeWhile";

export function take<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  numResults: number
) {
  return takeWhile(iterable, (_, index) => index! < numResults);
}
