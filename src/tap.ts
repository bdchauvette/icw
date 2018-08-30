import { IterableLike } from "./IterableLike";
import { withIndex } from "./withIndex";

export async function* tap<T>(
  iterableLike: IterableLike<T>,
  callback: (value: T, index?: number) => void | Promise<void>,
  thisArg?: any
): AsyncIterableIterator<T> {
  for await (let [value, index] of withIndex(iterableLike)) {
    Reflect.apply(callback, thisArg, [value, index]);
    yield value;
  }
}
