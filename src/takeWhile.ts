import { withIndex } from "./withIndex";
import { IterableLike } from "./IterableLike";

export async function* takeWhile<T>(
  iterableLike: IterableLike<T>,
  predicate: (value: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): AsyncIterableIterator<T> {
  for await (let [value, index] of withIndex(iterableLike)) {
    let valueIsOK = await Reflect.apply(predicate, thisArg, [value, index]);
    if (valueIsOK) yield value;
    else return;
  }
}
