import { withIndex } from "./withIndex";

export async function* skipWhile<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  shouldSkip: (value: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): AsyncIterableIterator<T> {
  let doneSkipping = false;

  for await (let [value, index] of withIndex(iterable)) {
    doneSkipping =
      doneSkipping || !(await shouldSkip.call(thisArg, value, index));

    if (doneSkipping) yield value;
  }
}
