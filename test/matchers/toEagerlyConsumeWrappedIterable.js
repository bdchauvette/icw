exports.toEagerlyConsumeWrappedIterable = async function toEagerlyConsumeWrappedIterable(
  received
) {
  let next = jest.fn().mockReturnValue({ done: true });
  let mockIterable = { [Symbol.iterator]: () => ({ next }) };

  received(mockIterable);

  return {
    message: () => `expected wrapper to eagerly consume wrapped iterable`,
    pass: next.mock.calls.length > 0
  };
};
