import { toIterable } from "./__internal__/toIterable";
import { IterableLike } from "./IterableLike";

export async function* uniqWith<T>(
  iterableLike: IterableLike<T>,
  callback: (a: T, b: T) => boolean | Promise<boolean>,
  thisArg?: any
): AsyncIterableIterator<T> {
  let seenValues = new Set();

  for await (let value of toIterable(iterableLike)) {
    let valueHasBeenSeen = false;

    for (let seenValue of seenValues) {
      if (await Reflect.apply(callback, thisArg, [value, seenValue])) {
        valueHasBeenSeen = true;
        break;
      }
    }

    if (!valueHasBeenSeen) {
      yield value;
      seenValues.add(value);
    }
  }
}
