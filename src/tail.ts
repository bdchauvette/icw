import { skip } from "./skip";
import { IterableLike } from "./IterableLike";
import { toIterable } from "./__internal__/toIterable";

export function tail<T>(
  iterableLike: IterableLike<T>
): AsyncIterableIterator<T> {
  return skip(toIterable(iterableLike), 1);
}
