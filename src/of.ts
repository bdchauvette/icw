/**
 * Creates an AsyncIterator that yields each argument.
 */
export async function* of<T>(...values: T[]): AsyncIterable<T> {
  yield* values;
}
