import { withIndex } from "./withIndex";

export async function* map<T, U>(
  iterable: AsyncIterable<T> | Iterable<T>,
  callbackFn: (value: T, index?: number) => U | Promise<U>,
  thisArg?: any
): AsyncIterableIterator<U> {
  for await (let [value, index] of withIndex(iterable)) {
    yield callbackFn.call(thisArg, value, index);
  }
}
