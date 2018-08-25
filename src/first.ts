import { take } from "./take";

export function first<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): AsyncIterableIterator<T> {
  return take(iterable, 1);
}
