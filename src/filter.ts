import { withIndex } from "./withIndex";

/**
 * Yields results from the input iterable that satisfy the provided condition.
 */
export const filter = <T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  shouldInclude: (result: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    for await (let [result, index] of withIndex(iterable)) {
      let resultIsOk = await shouldInclude.call(thisArg, result, index);
      if (resultIsOk) yield result;
    }
  }
});
