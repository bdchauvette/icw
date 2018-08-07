/**
 * Creates an async iterable that yields a tuple of [result, index] for each
 * result from the source iterable.
 */
export const withIndex = <T>(
  iterable: Iterable<T> | AsyncIterable<T>
): AsyncIterable<[T, number]> => ({
  async *[Symbol.asyncIterator]() {
    let index = 0;
    for await (let result of iterable) {
      yield [result, index];
      index += 1;
    }
  }
});
