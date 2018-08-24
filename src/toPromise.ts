export async function toPromise<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): Promise<T | undefined> {
  for await (let value of iterable) return value;
}
