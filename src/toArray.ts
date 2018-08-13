import { collect } from "./collect";
import { toPromise } from "./toPromise";

export async function toArray<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): Promise<T[]> {
  return toPromise(collect(iterable)) as Promise<T[]>;
}
