import { skip } from "./skip";
import { IterableLike } from "./IterableLike";
import { from } from "./from";

export function tail<T>(
  iterableLike: IterableLike<T>
): AsyncIterableIterator<T> {
  return skip(from(iterableLike), 1);
}
