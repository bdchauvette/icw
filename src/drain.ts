export async function drain<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): Promise<void> {
  for await (let _ of iterable) continue;
}
