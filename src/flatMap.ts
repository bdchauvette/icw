import { IterableLike } from "./IterableLike";
import { flat } from "./flat";
import { map } from "./map";

export function flatMap<T, U>(
  iterableLike: IterableLike<T>,
  callback: (value: T, index?: number) => U | Promise<U>,
  thisArg?: any
): AsyncIterableIterator<U> {
  let map$ = map(iterableLike, callback, thisArg);
  return flat(map$, 1);
}
