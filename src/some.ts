import { IterableLike } from "./IterableLike";
import { withIndex } from "./withIndex";

export async function some<T>(
  iterableLike: IterableLike<T>,
  predicate: (value: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): Promise<boolean> {
  for await (let [value, index] of withIndex(iterableLike)) {
    let iterableDidPass = Reflect.apply(predicate, thisArg, [value, index]);
    if (await iterableDidPass) return true;
  }

  return false;
}
