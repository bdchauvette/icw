import { withIndex } from "./withIndex";

export async function* skipWhile<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  predicate: (value: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): AsyncIterableIterator<T> {
  let doneSkipping = false;

  for await (let [value, index] of withIndex(iterable)) {
    doneSkipping =
      doneSkipping ||
      !(await Reflect.apply(predicate, thisArg, [value, index]));

    if (doneSkipping) yield value;
  }
}
