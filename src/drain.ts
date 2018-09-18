import { toIterable } from "./__internal__/toIterable";
import { IterableLike } from "./IterableLike";

export async function drain<T>(iterableLike: IterableLike<T>): Promise<void> {
  for await (let _ of toIterable(iterableLike)) continue;
}
