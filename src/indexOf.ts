import { isSameValueZero } from "./__internal__/isSameValueZero";
import { IterableLike } from "./IterableLike";
import { withIndex } from "./withIndex";

export async function indexOf<T>(
  iterableLike: IterableLike<T>,
  targetValue: T,
  fromIndex = 0
): Promise<number> {
  for await (let [value, index] of withIndex(iterableLike)) {
    if (index < fromIndex) continue;
    if (isSameValueZero(value, targetValue)) return index;
  }
  return -1;
}
