export async function* take<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  numToTake: number
): AsyncIterableIterator<T> {
  let numTaken = 0;
  for await (let result of iterable) {
    numTaken += 1;
    if (numTaken > numToTake) return;
    yield result;
  }
}
