export async function* skip<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  numToSkip: number
): AsyncIterableIterator<T> {
  let numSkipped = 0;
  for await (let value of iterable) {
    if (numSkipped < numToSkip) numSkipped += 1;
    else yield value;
  }
}
