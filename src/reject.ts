import { withIndex } from "./withIndex";

/**
 * Rejects results from the input iterable that satisfy the provided condition.
 *
 * All other results will be yielded.
 *
 * This function is the complement of `filter`.
 */
export const reject = <T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  shouldReject: (result: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    for await (let [result, index] of withIndex(iterable)) {
      let resultIsRejected = await shouldReject.call(thisArg, result, index);
      if (!resultIsRejected) yield result;
    }
  }
});
