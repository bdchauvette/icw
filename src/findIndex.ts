import { IterableLike } from "./IterableLike";
import { withIndex } from "./withIndex";

export async function findIndex<T>(
  iterableLike: IterableLike<T>,
  predicate: (value: T, index?: number) => number | Promise<number>,
  thisArg?: any
): Promise<number> {
  for await (let [value, index] of withIndex(iterableLike)) {
    let valueIsTarget = await Reflect.apply(predicate, thisArg, [value, index]);
    if (valueIsTarget) return index;
  }
  return -1;
}
