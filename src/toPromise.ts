/**
 * Returns a Promise that resolves to the first value of the iterable.
 *
 * If the iterable does not yield any values, the Promise will resolve to
 * `undefined`.
 */
export async function toPromise<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): Promise<T | undefined> {
  for await (let result of iterable) return result;
}
