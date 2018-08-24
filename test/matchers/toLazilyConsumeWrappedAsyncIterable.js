exports.toLazilyConsumeWrappedAsyncIterable = async function toLazilyConsumeWrappedAsyncIterable(
  received
) {
  let next = jest.fn().mockResolvedValue({ done: true });
  let mockIterable = { [Symbol.asyncIterator]: () => ({ next }) };

  let wrapper = received(mockIterable);
  let wrapper$ = wrapper[Symbol.asyncIterator]();

  if (next.mock.calls.length > 0) {
    return {
      message: () =>
        `expected wrapper not to eagerly consume wrapped async iterable`,
      pass: false
    };
  }

  await wrapper$.next();
  if (next.mock.calls.length > 0) {
    return {
      message: () =>
        `expected wrapper to lazily consume wrapped async iterable`,
      pass: true
    };
  }

  return {
    message: () => `expected wrapper to consume wrapped async iterable`,
    pass: false
  };
};
