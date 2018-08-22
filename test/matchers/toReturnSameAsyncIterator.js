exports.toReturnSameAsyncIterator = function toReturnSameAsyncIterator(
  received
) {
  let firstIterator = received[Symbol.asyncIterator]();
  let secondIterator = received[Symbol.asyncIterator]();

  let pass = firstIterator === secondIterator;

  let message = pass
    ? () => `expected ${received} to return same iterator on each call`
    : () => `expected ${received} to not return a fresh iterator on each call`;

  return { message, pass };
};
