import { IterableLike } from "./IterableLike";
import { toIterable } from "./__internal__/toIterable";

export async function* withIndex<T>(
  iterableLike: IterableLike<T>
): AsyncIterableIterator<[T, number]> {
  let index = 0;
  for await (let value of toIterable(iterableLike)) {
    yield [value, index];
    index += 1;
  }
}
