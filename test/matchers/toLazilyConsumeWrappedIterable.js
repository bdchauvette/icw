exports.toLazilyConsumeWrappedIterable = async function toLazilyConsumeWrappedIterable(
  received
) {
  let next = jest.fn().mockReturnValue({ done: true });
  let mockIterable = { [Symbol.iterator]: () => ({ next }) };

  let wrapper = received(mockIterable);
  let wrapper$ = wrapper[Symbol.asyncIterator]();

  if (next.mock.calls.length > 0) {
    return {
      message: () => `expected wrapper not to eagerly consume wrapped iterable`,
      pass: false
    };
  }

  await wrapper$.next();
  if (next.mock.calls.length > 0) {
    return {
      message: () => `expected wrapper to lazily consume wrapped iterable`,
      pass: true
    };
  }

  return {
    message: () => `expected wrapper to consume wrapped iterable`,
    pass: false
  };
};
