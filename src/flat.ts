import { toIterable } from "./__internal__/toIterable";
import { IterableLike } from "./IterableLike";
import { isIterableLike } from "./__internal__/isIterableLike";
import { isString } from "./__internal__/isString";

export async function* flat<T>(
  iterableLike: IterableLike<T>,
  depth = 1
): AsyncIterableIterator<T> {
  for await (let value of toIterable(iterableLike)) {
    if (depth > 0 && isFlattenable(value)) {
      yield* flat(value, depth - 1);
    } else {
      yield value;
    }
  }
}

function isFlattenable<T>(
  value: T | IterableLike<T>
): value is IterableLike<T> {
  if (isString(value)) return false;
  return isIterableLike(value);
}
