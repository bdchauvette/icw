import { from } from "./from";
import { IterableLike } from "./IterableLike";

export async function* takeLast<T>(
  iterableLike: IterableLike<T>,
  numToTake: number
): AsyncIterableIterator<T> {
  if (numToTake <= 0) return;

  let buffer = [];

  for await (let value of from(iterableLike)) {
    buffer.push(value);
    if (buffer.length > numToTake) buffer.shift();
  }

  yield* buffer;
}
