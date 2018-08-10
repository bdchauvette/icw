import { withIndex } from "./withIndex";

export function scan<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  accumulate: (accumulator: T, result: T, index?: number) => T | Promise<T>,
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
