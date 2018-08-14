import { withIndex } from "./withIndex";

export async function* filter<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  shouldInclude: (result: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): AsyncIterableIterator<T> {
  for await (let [result, index] of withIndex(iterable)) {
    let resultIsOk = await shouldInclude.call(thisArg, result, index);
    if (resultIsOk) yield result;
  }
}
