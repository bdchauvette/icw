import { from } from "./from";
import { IterableLike } from "./IterableLike";
import { isIterableLike } from "./__internal__/isIterableLike";

export async function* flat<T>(
  iterableLike: IterableLike<T>,
  depth = 1
): AsyncIterableIterator<T> {
  for await (let value of from(iterableLike)) {
    if (depth > 0 && isIterableLike<T>(value)) {
      yield* flat(value, depth - 1);
    } else {
      yield value;
    }
  }
}
