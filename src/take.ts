import { isNumber } from "./__internal__/isNumber";
import { toIterable } from "./__internal__/toIterable";
import { IterableLike } from "./IterableLike";

export async function* take<T>(
  iterableLike: IterableLike<T>,
  numToTake: number
): AsyncIterableIterator<T> {
  if (!isNumber(numToTake) || numToTake < 0) {
    throw new RangeError("numToTake must be a non-negative number");
  }

  let numTaken = 0;
  for await (let value of toIterable(iterableLike)) {
    numTaken += 1;
    if (numTaken > numToTake) return;
    yield value;
  }
}
