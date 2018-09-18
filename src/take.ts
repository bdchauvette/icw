import { toIterable } from "./__internal__/toIterable";
import { IterableLike } from "./IterableLike";

export async function* take<T>(
  iterableLike: IterableLike<T>,
  numToTake: number
): AsyncIterableIterator<T> {
  let numTaken = 0;
  for await (let value of toIterable(iterableLike)) {
    numTaken += 1;
    if (numTaken > numToTake) return;
    yield value;
  }
}
