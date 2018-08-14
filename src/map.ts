import { withIndex } from "./withIndex";

export async function* map<T, U>(
  iterable: AsyncIterable<T> | Iterable<T>,
  callbackFn: (result: T, index?: number) => U | Promise<U>,
  thisArg?: any
): AsyncIterableIterator<U> {
  for await (let [result, index] of withIndex(iterable)) {
    yield callbackFn.call(thisArg, result, index, iterable);
  }
}
