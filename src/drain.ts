import { from } from "./from";
import { IterableLike } from "./IterableLike";

export async function drain<T>(iterableLike: IterableLike<T>): Promise<void> {
  for await (let _ of from(iterableLike)) continue;
}
