import { AnyIterable } from "./types";
import { withIndex } from "./withIndex";

export type ScanCallback<T> = (
  accumulator: T,
  currentValue: T,
  index?: number
) => T;

export function scan<T>(
  iterable: AnyIterable<T>,
  accumulate: ScanCallback<T>,
  initialValue?: T
): AsyncIterable<T> {
  let useFirstResultAsInitialValue = arguments.length < 3;

  return {
    async *[Symbol.asyncIterator]() {
      let accumulator = initialValue;

      for await (let [result, index] of withIndex(iterable)) {
        accumulator = await accumulate(
          index === 0 && useFirstResultAsInitialValue
            ? result
            : (accumulator as T),
          result,
          index
        );

        yield accumulator;
      }
    }
  };
}
