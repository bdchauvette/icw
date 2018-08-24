import { withIndex } from "./withIndex";

export async function* reject<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  shouldReject: (value: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): AsyncIterableIterator<T> {
  for await (let [value, index] of withIndex(iterable)) {
    let valueIsRejected = await shouldReject.call(thisArg, value, index);
    if (!valueIsRejected) yield value;
  }
}
