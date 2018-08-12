import { withIndex } from "./withIndex";

export function takeWhile<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  shouldTake: (result: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
) {
  return {
    async *[Symbol.asyncIterator]() {
      for await (let [result, index] of withIndex(iterable)) {
        let resultShouldBeTaken = await shouldTake.call(thisArg, result, index);
        if (resultShouldBeTaken) yield result;
        else break;
      }
    }
  };
}
