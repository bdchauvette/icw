import { isNumber } from "./__internal__/isNumber";
import { toIterable } from "./__internal__/toIterable";
import { IterableLike } from "./IterableLike";

export async function* skipLast<T>(
  iterableLike: IterableLike<T>,
  numToSkip: number
): AsyncIterableIterator<T> {
  if (!isNumber(numToSkip) || numToSkip < 0) {
    throw new RangeError("numToSkip must be a non-negative number");
  }

  let buffer = [];

  for await (let value of toIterable(iterableLike)) {
    buffer.push(value);
    if (buffer.length > numToSkip) yield buffer.shift() as T;
  }
}
