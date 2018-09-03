import { IterableLike } from "./IterableLike";
import { withIndex } from "./withIndex";

export async function findLast<T>(
  iterableLike: IterableLike<T>,
  predicate: (value: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): Promise<T | undefined> {
  let lastValue = undefined;
  for await (let [value, index] of withIndex(iterableLike)) {
    let valueIsTarget = await Reflect.apply(predicate, thisArg, [value, index]);
    if (valueIsTarget) lastValue = value;
  }
  return lastValue;
}
