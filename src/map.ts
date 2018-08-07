import { withIndex } from "./withIndex";

export type MapCallback<T, U, TH> = (
  this: TH,
  result: T,
  index?: number
) => U | Promise<U>;

/**
 * Creates an AsyncIterator that yields each argument.
 */
export const map = <T, U, TH>(
  iterable: Iterable<T> | AsyncIterable<T>,
  callbackFn: MapCallback<T, U, TH>,
  thisArg?: TH
): AsyncIterable<U> => ({
  async *[Symbol.asyncIterator]() {
    for await (let [result, index] of withIndex(iterable)) {
      yield callbackFn.call(thisArg, result, index, iterable);
    }
  }
});
