import { withIndex } from "./withIndex";

/**
 * Creates an AsyncIterator that yields each argument.
 */
export function map<T, U>(
  iterable: AsyncIterable<T> | Iterable<T>,
  callbackFn: (result: T, index?: number) => U | Promise<U>,
  thisArg?: any
): AsyncIterable<U> {
  return {
    async *[Symbol.asyncIterator]() {
      for await (let [result, index] of withIndex(iterable)) {
        yield callbackFn.call(thisArg, result, index, iterable);
      }
    }
  };
}
