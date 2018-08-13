import { withIndex } from "./withIndex";

/**
 * Creates an AsyncIterator that yields each argument.
 */
export async function* map<T, U>(
  iterable: AsyncIterable<T> | Iterable<T>,
  callbackFn: (result: T, index?: number) => U | Promise<U>,
  thisArg?: any
): AsyncIterable<U> {
  for await (let [result, index] of withIndex(iterable)) {
    yield callbackFn.call(thisArg, result, index, iterable);
  }
}
