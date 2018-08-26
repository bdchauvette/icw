import { withIndex } from "./withIndex";

export async function* tap<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  predicate: (value: T, index?: number) => void | Promise<void>,
  thisArg?: any
): AsyncIterableIterator<T> {
  for await (let [value, index] of withIndex(iterable)) {
    Reflect.apply(predicate, thisArg, [value, index]);
    yield value;
  }
}
