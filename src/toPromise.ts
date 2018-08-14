export async function toPromise<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): Promise<T | undefined> {
  for await (let result of iterable) return result;
}
