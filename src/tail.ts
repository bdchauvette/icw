import { skip } from "./skip";
import { IterableLike } from "./IterableLike";

export function tail<T>(
  iterableLike: IterableLike<T>
): AsyncIterableIterator<T> {
  return skip(iterableLike, 1);
}
