import { withIndex } from "./withIndex";

export async function* some<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  doesPass: (value: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): AsyncIterableIterator<boolean> {
  let iterableDidPass = false;

  for await (let [value, index] of withIndex(iterable)) {
    iterableDidPass = !!(await doesPass.call(thisArg, value, index));
    if (iterableDidPass) break;
  }

  yield iterableDidPass;
}
