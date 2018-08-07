import { AnyIterable } from "./types";
import { withIndex } from "./withIndex";

export type FilterCallback<T, TH> = (
  this: TH,
  result: T,
  index?: number
) => boolean | Promise<boolean>;

/**
 * Yields results from the input iterable that satisfy the provided condition.
 */
export const filter = <T, TH>(
  iterable: AnyIterable<T>,
  shouldInclude: FilterCallback<T, TH>,
  thisArg?: TH
): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    for await (let [result, index] of withIndex(iterable)) {
      let resultIsOk = await shouldInclude.call(thisArg, result, index);
      if (resultIsOk) yield result;
    }
  }
});
