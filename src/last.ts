export async function* last<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): AsyncIterableIterator<T> {
  let lastValue: T;
  for await (let value of iterable) lastValue = value;
  yield lastValue!;
}
