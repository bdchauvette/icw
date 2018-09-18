import { isString } from "./__internal__/isString";
import { toIterable } from "./__internal__/toIterable";
import { IterableLike } from "./IterableLike";

export async function last<T>(
  iterableLike: IterableLike<T>
): Promise<T | undefined> {
  // Avoid iterating if we can do random access
  if (Array.isArray(iterableLike) || isString(iterableLike)) {
    return iterableLike[iterableLike.length - 1];
  }

  let lastValue = undefined;
  for await (let value of toIterable(iterableLike)) lastValue = value;
  return lastValue;
}
