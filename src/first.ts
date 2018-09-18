import { toIterable } from "./__internal__/toIterable";
import { IterableLike } from "./IterableLike";
import { nth } from "./nth";

export function first<T>(
  iterableLike: IterableLike<T>
): Promise<T | undefined> {
  return nth(toIterable(iterableLike), 0);
}
