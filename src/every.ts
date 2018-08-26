import { withIndex } from "./withIndex";

export async function* every<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  predicate: (value: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): AsyncIterableIterator<boolean> {
  let iterableDidPass = false;

  for await (let [value, index] of withIndex(iterable)) {
    iterableDidPass = !!(await Reflect.apply(predicate, thisArg, [
      value,
      index
    ]));
    if (!iterableDidPass) break;
  }

  yield iterableDidPass;
}
