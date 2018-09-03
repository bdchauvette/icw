import { IterableLike } from "./IterableLike";
import { withIndex } from "./withIndex";

export async function findLastIndex<T>(
  iterableLike: IterableLike<T>,
  predicate: (value: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): Promise<number> {
  let lastIndex = -1;
  for await (let [value, index] of withIndex(iterableLike)) {
    let valueIsTarget = await Reflect.apply(predicate, thisArg, [value, index]);
    if (valueIsTarget) lastIndex = index;
  }
  return lastIndex;
}
