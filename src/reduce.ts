import { last } from "./last";
import { scan } from "./scan";

export function reduce<T>(
  ...args: [
    AsyncIterable<T> | Iterable<T>,
    (accumulator: T, value: T, index?: number) => T | Promise<T>,
    T?
  ]
): AsyncIterableIterator<T> {
  return last(scan(...args));
}
