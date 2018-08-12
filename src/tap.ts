import { withIndex } from "./withIndex";

export function tap<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  callback: (result: T, index?: number) => void | Promise<void>,
  thisArg?: any
): AsyncIterable<T> {
  return {
    async *[Symbol.asyncIterator]() {
      for await (let [result, index] of withIndex(iterable)) {
        callback.call(thisArg, result, index);
        yield result;
      }
    }
  };
}
