export const consume = async <T>(
  iterable: Iterable<T> | AsyncIterable<T>
): Promise<void> => {
  // @ts-ignore
  for await (let result of iterable) continue;
};
