/**
 * Creates an AsyncIterator that yields each argument.
 */
export const of = <T>(...values: T[]): AsyncIterable<T> => ({
  async *[Symbol.asyncIterator]() {
    yield* values;
  }
});
