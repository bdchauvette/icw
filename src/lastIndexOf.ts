import { isSameValueZero } from "./__internal__/isSameValueZero";
import { IterableLike } from "./IterableLike";
import { withIndex } from "./withIndex";

export async function lastIndexOf<T>(
  iterableLike: IterableLike<T>,
  targetValue: T,
  fromIndex = 0
): Promise<number> {
  let lastIndex = -1;
  for await (let [value, index] of withIndex(iterableLike)) {
    if (index < fromIndex) continue;
    if (isSameValueZero(value, targetValue)) lastIndex = index;
  }
  return lastIndex;
}
