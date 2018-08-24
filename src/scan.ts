import { withIndex } from "./withIndex";

export async function* scan<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  accumulate: (accumulator: T, value: T, index?: number) => T | Promise<T>,
  initialValue?: T
): AsyncIterableIterator<T> {
  let firstValueIsInitialAccumulator = arguments.length < 3;
  let accumulator = initialValue;

  for await (let [value, index] of withIndex(iterable)) {
    accumulator = await accumulate(
      index === 0 && firstValueIsInitialAccumulator
        ? value
        : (accumulator as T),
      value,
      index
    );

    yield accumulator;
  }
}
