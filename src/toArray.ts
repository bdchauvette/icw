import { IterableLike } from "./IterableLike";
import { toIterable } from "./__internal__/toIterable";

export async function toArray<T>(iterableLike: IterableLike<T>): Promise<T[]> {
  let values = [];
  for await (let value of toIterable(iterableLike)) values.push(value);
  return values;
}
