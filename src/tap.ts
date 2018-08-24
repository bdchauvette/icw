import { withIndex } from "./withIndex";

export async function* tap<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  callback: (value: T, index?: number) => void | Promise<void>,
  thisArg?: any
): AsyncIterableIterator<T> {
  for await (let [value, index] of withIndex(iterable)) {
    callback.call(thisArg, value, index);
    yield value;
  }
}
