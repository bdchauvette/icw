import { flat } from "./flat";
import { from } from "./from";
import { IterableLike } from "./IterableLike";

export async function* concat<T, U>(
  iterableLike: IterableLike<T>,
  ...values: U[]
): AsyncIterableIterator<T | U> {
  yield* from(iterableLike);
  yield* flat(values, 1);
}
