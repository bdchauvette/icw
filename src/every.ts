import { IterableLike } from "./IterableLike";
import { withIndex } from "./withIndex";

export async function every<T>(
  iterableLike: IterableLike<T>,
  predicate: (value: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): Promise<boolean> {
  let iterableDidPass = false;

  for await (let [value, index] of withIndex(iterableLike)) {
    iterableDidPass = Reflect.apply(predicate, thisArg, [value, index]);
    if (!(await iterableDidPass)) return false;
  }

  return iterableDidPass;
}
