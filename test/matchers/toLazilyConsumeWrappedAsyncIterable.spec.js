test("passes when received value lazily consumes wrapped async iterable", async () => {
  expect.assertions(1);

  await expect(_ => lazyWrapper(_)).toLazilyConsumeWrappedAsyncIterable();

  async function* lazyWrapper(iterable) {
    for await (let value of iterable) yield value;
  }
});

test("fails when received value eagerly consumes wrapped async iterable", async () => {
  expect.assertions(2);

  await expect(
    expect(_ => eagerWrapper(_)).toLazilyConsumeWrappedAsyncIterable()
  ).rejects.toThrowErrorMatchingSnapshot(); // eslint-disable-line jest/prefer-inline-snapshots

  function eagerWrapper(iterable) {
    let iterator = iterable[Symbol.asyncIterator]();
    iterator.next();
    return (async function*() {})();
  }
});

test("fails when received value does not consume wrapped async iterable", async () => {
  expect.assertions(2);

  await expect(
    expect(_ => noopWrapper(_)).toLazilyConsumeWrappedAsyncIterable()
  ).rejects.toThrowErrorMatchingSnapshot(); // eslint-disable-line jest/prefer-inline-snapshots

  async function* noopWrapper() {}
});
