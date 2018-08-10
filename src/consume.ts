export async function consume<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): Promise<void> {
  // @ts-ignore
  for await (let result of iterable) continue;
}
