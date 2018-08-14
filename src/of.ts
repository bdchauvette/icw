export async function* of<T>(...values: T[]): AsyncIterableIterator<T> {
  yield* values;
}
