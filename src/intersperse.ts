import { from } from "./from";
import { IterableLike } from "./IterableLike";

export async function* intersperse<T, S>(
  iterableLike: IterableLike<T>,
  separator: S
): AsyncIterableIterator<T | S> {
  let shouldYieldSeparator = false;

  for await (let value of from(iterableLike)) {
    if (shouldYieldSeparator) yield separator;
    yield value;
    shouldYieldSeparator = true;
  }
}
