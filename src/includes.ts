import { from } from "./from";
import { IterableLike } from "./IterableLike";
import { isSameValueZero } from "./__internal__/isSameValueZero";

export async function includes<T>(
  iterableLike: IterableLike<T>,
  targetValue: T
): Promise<boolean> {
  for await (let value of from(iterableLike)) {
    if (isSameValueZero(value, targetValue)) return true;
  }
  return false;
}
