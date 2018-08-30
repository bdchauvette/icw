import { IterableLike } from "./IterableLike";
import { from } from "./from";

export async function toArray<T>(iterableLike: IterableLike<T>): Promise<T[]> {
  let values = [];
  for await (let value of from(iterableLike)) values.push(value);
  return values;
}
