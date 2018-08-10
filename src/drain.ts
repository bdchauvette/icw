export async function drain<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): Promise<void> {
  // @ts-ignore
  for await (let result of iterable) continue;
}
