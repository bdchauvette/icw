import { withIndex } from "./withIndex";

export async function* takeWhile<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  predicate: (value: T, index?: number) => boolean | Promise<boolean>,
  thisArg?: any
): AsyncIterableIterator<T> {
  for await (let [value, index] of withIndex(iterable)) {
    let valueIsOK = await Reflect.apply(predicate, thisArg, [value, index]);
    if (valueIsOK) yield value;
    else return;
  }
}
