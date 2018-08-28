import { isString } from "./__internal__/isString";
import { withIndex } from "./withIndex";
import { IterableLike } from "./IterableLike";

export async function nth<T>(
  iterableLike: IterableLike<T>,
  targetIndex: number
): Promise<T | undefined> {
  // Avoid iterating if we can do random access
  if (Array.isArray(iterableLike) || isString(iterableLike)) {
    return iterableLike[targetIndex];
  }

  for await (let [value, resultIndex] of withIndex(iterableLike)) {
    if (resultIndex === targetIndex) return value;
  }
}
