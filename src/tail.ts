import { skip } from "./skip";

export function tail<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): AsyncIterableIterator<T> {
  return skip(iterable, 1);
}
