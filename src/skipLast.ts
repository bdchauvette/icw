import { toIterable } from "./__internal__/toIterable";
import { IterableLike } from "./IterableLike";

export async function* skipLast<T>(
  iterableLike: IterableLike<T>,
  numToSkip: number
): AsyncIterableIterator<T> {
  let buffer = [];

  for await (let value of toIterable(iterableLike)) {
    buffer.push(value);
    if (buffer.length > numToSkip) yield buffer.shift() as T;
  }
}
