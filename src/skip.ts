import { toIterable } from "./__internal__/toIterable";
import { IterableLike } from "./IterableLike";

export async function* skip<T>(
  iterableLike: IterableLike<T>,
  numToSkip: number
): AsyncIterableIterator<T> {
  let numSkipped = 0;
  for await (let value of toIterable(iterableLike)) {
    if (numSkipped < numToSkip) numSkipped += 1;
    else yield value;
  }
}
