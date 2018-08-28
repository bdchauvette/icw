import { IterableLike } from "./IterableLike";
import { from } from "./from";

export async function* withIndex<T>(
  iterableLike: IterableLike<T>
): AsyncIterableIterator<[T, number]> {
  let index = 0;
  for await (let value of from(iterableLike)) {
    yield [value, index];
    index += 1;
  }
}
