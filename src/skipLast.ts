import { from } from "./from";
import { IterableLike } from "./IterableLike";

export async function* skipLast<T>(
  iterableLike: IterableLike<T>,
  numToSkip: number
): AsyncIterableIterator<T> {
  let buffer = [];

  for await (let value of from(iterableLike)) {
    buffer.push(value);
    if (buffer.length > numToSkip) yield buffer.shift() as T;
  }
}
