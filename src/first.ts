import { from } from "./from";
import { IterableLike } from "./IterableLike";
import { nth } from "./nth";

export function first<T>(
  iterableLike: IterableLike<T>
): Promise<T | undefined> {
  return nth(from(iterableLike), 0);
}
