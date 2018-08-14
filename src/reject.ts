import { withIndex } from "./withIndex";

export async function* reject<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  shouldReject: (result: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): AsyncIterableIterator<T> {
  for await (let [result, index] of withIndex(iterable)) {
    let resultIsRejected = await shouldReject.call(thisArg, result, index);
    if (!resultIsRejected) yield result;
  }
}
