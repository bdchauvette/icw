expect.extend({
  toReturnSameAsyncIterator
});

function toReturnSameAsyncIterator(received) {
  let firstIterable = received[Symbol.asyncIterator]();
  let secondIterable = received[Symbol.asyncIterator]();

  let pass = firstIterable === secondIterable;

  let message = pass
    ? () => `expected ${received} to return same iterator on each call`
    : () => `expected ${received} to not return a fresh iterator on each call`;

  return { message, pass };
}
