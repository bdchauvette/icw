import { flat } from "./flat";
import { toIterable } from "./__internal__/toIterable";
import { IterableLike } from "./IterableLike";

export async function* concat<T, U>(
  iterableLike: IterableLike<T>,
  ...values: U[]
): AsyncIterableIterator<T | U> {
  yield* toIterable(iterableLike);
  yield* flat(values, 1);
}
