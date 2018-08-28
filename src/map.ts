import { IterableLike } from "./IterableLike";
import { withIndex } from "./withIndex";

export async function* map<T, U>(
  iterableLike: IterableLike<T>,
  callback: (value: T, index?: number) => U | Promise<U>,
  thisArg?: any
): AsyncIterableIterator<U> {
  for await (let [value, index] of withIndex(iterableLike)) {
    yield Reflect.apply(callback, thisArg, [value, index]);
  }
}
