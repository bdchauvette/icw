import { IterableLike } from "./IterableLike";
import { withIndex } from "./withIndex";

export async function* skipWhile<T>(
  iterableLike: IterableLike<T>,
  predicate: (value: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): AsyncIterableIterator<T> {
  let doneSkipping = false;

  for await (let [value, index] of withIndex(iterableLike)) {
    doneSkipping =
      doneSkipping ||
      !(await Reflect.apply(predicate, thisArg, [value, index]));

    if (doneSkipping) yield value;
  }
}
