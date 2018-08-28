import { IterableLike } from "./IterableLike";
import { withIndex } from "./withIndex";

export async function* scan<T, R>(
  iterableLike: IterableLike<T>,
  accumulate: (accumulator: R, value: T, index?: number) => R | Promise<R>,
  initialValue?: R
): AsyncIterableIterator<R> {
  let firstValueIsSeed = arguments.length < 3;
  let accumulator = initialValue;

  for await (let [value, index] of withIndex(iterableLike)) {
    accumulator = await accumulate(
      index === 0 && firstValueIsSeed
        ? ((value as any) as R)
        : (accumulator as R),
      value,
      index
    );

    yield accumulator;
  }
}
