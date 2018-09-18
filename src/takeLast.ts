import { toIterable } from "./__internal__/toIterable";
import { IterableLike } from "./IterableLike";

export async function* takeLast<T>(
  iterableLike: IterableLike<T>,
  numToTake: number
): AsyncIterableIterator<T> {
  if (numToTake <= 0) return;

  let buffer = [];

  for await (let value of toIterable(iterableLike)) {
    buffer.push(value);
    if (buffer.length > numToTake) buffer.shift();
  }

  yield* buffer;
}
