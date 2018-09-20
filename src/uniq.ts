import { IterableLike } from "./IterableLike";
import { uniqBy } from "./uniqBy";

export function uniq<T>(
  iterableLike: IterableLike<T>
): AsyncIterableIterator<T> {
  return uniqBy(iterableLike, identity);
}

function identity<T>(value: T): T {
  return value;
}
