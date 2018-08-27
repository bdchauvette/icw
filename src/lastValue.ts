import { firstValue } from "./firstValue";
import { last } from "./last";
import { isString } from "./__internal__/isString";

export async function lastValue<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): Promise<T | undefined> {
  // Avoid iterating if we can do random access
  if (Array.isArray(iterable) || isString(iterable)) {
    return iterable[iterable.length - 1];
  }

  return firstValue(last(iterable));
}
