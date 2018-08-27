import { isString } from "./__internal__/isString";
import { withIndex } from "./withIndex";

export async function nthValue<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  targetIndex: number
): Promise<T | undefined> {
  // Avoid iterating if we can do random access
  if (Array.isArray(iterable) || isString(iterable)) {
    return iterable[targetIndex];
  }

  for await (let [value, resultIndex] of withIndex(iterable)) {
    if (resultIndex === targetIndex) return value;
  }
}
