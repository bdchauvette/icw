import { withIndex } from "./withIndex";

export async function* reject<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  predicate: (value: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): AsyncIterableIterator<T> {
  for await (let [value, index] of withIndex(iterable)) {
    let valueIsRejected = await Reflect.apply(predicate, thisArg, [
      value,
      index
    ]);
    if (!valueIsRejected) yield value;
  }
}
