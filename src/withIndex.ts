export async function* withIndex<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): AsyncIterableIterator<[T, number]> {
  let index = 0;
  for await (let result of iterable) {
    yield [result, index];
    index += 1;
  }
}
