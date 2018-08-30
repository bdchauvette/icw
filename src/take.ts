import { from } from "./from";
import { IterableLike } from "./IterableLike";

export async function* take<T>(
  iterableLike: IterableLike<T>,
  numToTake: number
): AsyncIterableIterator<T> {
  let numTaken = 0;
  for await (let value of from(iterableLike)) {
    numTaken += 1;
    if (numTaken > numToTake) return;
    yield value;
  }
}
