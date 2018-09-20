import { toIterable } from "./__internal__/toIterable";
import { IterableLike } from "./IterableLike";

export async function* uniqBy<T, U>(
  iterableLike: IterableLike<T>,
  callback: (value: T) => U | Promise<U>,
  thisArg?: any
): AsyncIterableIterator<T> {
  let seenValues = new Set();

  for await (let value of toIterable(iterableLike)) {
    let normalizedValue = await Reflect.apply(callback, thisArg, [value]);
    if (!seenValues.has(normalizedValue)) {
      yield value;
      seenValues.add(normalizedValue);
    }
  }
}
