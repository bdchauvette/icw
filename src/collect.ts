export async function* collect<T>(
  iterable: AsyncIterable<T> | Iterable<T>
): AsyncIterable<T[]> {
  let collectedResults = [];
  for await (let result of iterable) collectedResults.push(result);
  yield collectedResults;
}
