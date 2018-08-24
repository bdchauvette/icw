import { withIndex } from "./withIndex";

export async function* filter<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  shouldInclude: (value: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): AsyncIterableIterator<T> {
  for await (let [value, index] of withIndex(iterable)) {
    let valueIsOK = await shouldInclude.call(thisArg, value, index);
    if (valueIsOK) yield value;
  }
}
