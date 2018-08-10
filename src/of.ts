/**
 * Creates an AsyncIterator that yields each argument.
 */
export function of<T>(...values: T[]): AsyncIterable<T> {
  return {
    async *[Symbol.asyncIterator]() {
      yield* values;
    }
  };
}
