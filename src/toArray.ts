import { collect } from "./collect";
import { firstValue } from "./firstValue";

export async function toArray<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): Promise<T[]> {
  return firstValue(collect(iterable))! as Promise<T[]>;
}
