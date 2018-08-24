export async function* collect<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): AsyncIterableIterator<T[]> {
  let values = [];
  for await (let value of iterable) values.push(value);
  yield values;
}
