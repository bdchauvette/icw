import { withIndex } from "./withIndex";

export async function* skipWhile<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  shouldSkip: (result: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): AsyncIterable<T> {
  let doneSkipping = false;

  for await (let [result, index] of withIndex(iterable)) {
    doneSkipping =
      doneSkipping || !(await shouldSkip.call(thisArg, result, index));

    if (doneSkipping) yield result;
  }
}
