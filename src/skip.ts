import { from } from "./from";
import { IterableLike } from "./IterableLike";

export async function* skip<T>(
  iterableLike: IterableLike<T>,
  numToSkip: number
): AsyncIterableIterator<T> {
  let numSkipped = 0;
  for await (let value of from(iterableLike)) {
    if (numSkipped < numToSkip) numSkipped += 1;
    else yield value;
  }
}
