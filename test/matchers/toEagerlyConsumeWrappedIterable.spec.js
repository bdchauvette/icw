test("passes when received value eagerly consumes wrapped iterable", async () => {
  expect.assertions(1);

  expect(_ => eagerWrapper(_)).toEagerlyConsumeWrappedIterable();

  function eagerWrapper(iterable) {
    let iterator = iterable[Symbol.iterator]();
    iterator.next();
  }
});

test("fails when received value does not consume wrapped iterable", async () => {
  expect.assertions(2);

  await expect(
    expect(_ => noopWrapper(_)).toEagerlyConsumeWrappedIterable()
  ).rejects.toThrowErrorMatchingSnapshot();

  function noopWrapper() {}
});
