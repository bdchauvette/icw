import { withIndex } from "./withIndex";

export async function forEach<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  callback: (value: T, index?: number) => void | Promise<void>,
  thisArg?: any
): Promise<void> {
  for await (let [value, index] of withIndex(iterable)) {
    callback.call(thisArg, value, index);
  }
}
