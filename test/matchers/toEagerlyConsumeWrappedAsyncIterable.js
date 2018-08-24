exports.toEagerlyConsumeWrappedAsyncIterable = async function toEagerlyConsumeWrappedAsyncIterable(
  received
) {
  let next = jest.fn(async () => ({ done: true }));
  let mockIterable = { [Symbol.asyncIterator]: () => ({ next }) };

  received(mockIterable);

  return {
    message: () => `expected wrapper to eagerly consume wrapped async iterable`,
    pass: next.mock.calls.length > 0
  };
};
