import { withIndex } from "./withIndex";

/**
 * Creates an AsyncIterator that yields each argument.
 */
export const map = <T, U>(
  iterable: Iterable<T> | AsyncIterable<T>,
  callbackFn: (result: T, index?: number) => U | Promise<U>,
  thisArg?: any
): AsyncIterable<U> => ({
  async *[Symbol.asyncIterator]() {
    for await (let [result, index] of withIndex(iterable)) {
      yield callbackFn.call(thisArg, result, index, iterable);
    }
  }
});
