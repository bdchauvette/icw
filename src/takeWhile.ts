import { withIndex } from "./withIndex";

export async function* takeWhile<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  shouldTake: (result: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): AsyncIterableIterator<T> {
  for await (let [result, index] of withIndex(iterable)) {
    let resultShouldBeTaken = await shouldTake.call(thisArg, result, index);
    if (resultShouldBeTaken) yield result;
    else break;
  }
}
