import { toIterable } from "./__internal__/toIterable";
import { IterableLike } from "./IterableLike";

export async function* uniq<T>(
  iterableLike: IterableLike<T>
): AsyncIterableIterator<T> {
  let seenValues = new Set();

  for await (let value of toIterable(iterableLike)) {
    if (!seenValues.has(value)) {
      seenValues.add(value);
      yield value;
    }
  }
}
