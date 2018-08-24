test("passes when received value eagerly consumes wrapped async iterable", async () => {
  expect.assertions(1);

  expect(_ => eagerWrapper(_)).toEagerlyConsumeWrappedAsyncIterable();

  function eagerWrapper(iterable) {
    let iterator = iterable[Symbol.asyncIterator]();
    iterator.next();
  }
});

test("fails when received value does not consume wrapped async iterable", async () => {
  expect.assertions(2);

  await expect(
    expect(_ => noopWrapper(_)).toEagerlyConsumeWrappedAsyncIterable()
  ).rejects.toThrowErrorMatchingSnapshot();

  function noopWrapper() {}
});
