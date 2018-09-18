import { toIterable } from "./__internal__/toIterable";
import { IterableLike } from "./IterableLike";
import { isSameValueZero } from "./__internal__/isSameValueZero";

export async function includes<T>(
  iterableLike: IterableLike<T>,
  targetValue: T
): Promise<boolean> {
  for await (let value of toIterable(iterableLike)) {
    if (isSameValueZero(value, targetValue)) return true;
  }
  return false;
}
