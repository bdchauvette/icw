import { isNumber } from "./__internal__/isNumber";
import { toIterable } from "./__internal__/toIterable";
import { IterableLike } from "./IterableLike";

export async function* takeLast<T>(
  iterableLike: IterableLike<T>,
  numToTake: number
): AsyncIterableIterator<T> {
  if (!isNumber(numToTake) || numToTake < 0) {
    throw new RangeError("numToTake must be a non-negative number");
  }

  if (numToTake === 0) return;

  let buffer = [];

  for await (let value of toIterable(iterableLike)) {
    buffer.push(value);
    if (buffer.length > numToTake) buffer.shift();
  }

  yield* buffer;
}
