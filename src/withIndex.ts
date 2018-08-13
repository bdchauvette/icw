/**
 * Creates an async iterable that yields a tuple of [result, index] for each
 * result from the source iterable.
 */
export async function* withIndex<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): AsyncIterable<[T, number]> {
  let index = 0;
  for await (let result of iterable) {
    yield [result, index];
    index += 1;
  }
}
