import { skipWhile } from "./skipWhile";

export function skip<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  numResults: number
): AsyncIterable<T> {
  return skipWhile(iterable, (_, index) => index! < numResults);
}
