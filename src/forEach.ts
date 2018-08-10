import { withIndex } from "./withIndex";

export async function forEach<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  callback: (result: T, index?: number) => void | Promise<void>,
  thisArg?: any
): Promise<void> {
  for await (let [result, index] of withIndex(iterable)) {
    callback.call(thisArg, result, index);
  }
}
