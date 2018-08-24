export async function* withIndex<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): AsyncIterableIterator<[T, number]> {
  let index = 0;
  for await (let value of iterable) {
    yield [value, index];
    index += 1;
  }
}
