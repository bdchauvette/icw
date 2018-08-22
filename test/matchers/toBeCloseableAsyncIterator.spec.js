test("passes when received value is a closeable async iterator", async () => {
  expect.assertions(1);

  async function* infiniteIterator() {
    while (true) yield;
  }

  await expect(infiniteIterator()).toBeCloseableAsyncIterator();
});

test("fails when iterator does not have a `return` method", async () => {
  expect.assertions(1);

  let iterable = {
    [Symbol.asyncIterator]() {
      let i = 0;
      return {
        next() {
          let result = { value: i, done: false };
          i += 1;
          return result;
        }
      };
    }
  };

  await expect(iterable).not.toBeCloseableAsyncIterator();
});

test("fails when iterator's `return` method does not actually close the iterator", async () => {
  expect.assertions(1);

  let iterable = {
    [Symbol.asyncIterator]() {
      let i = 0;
      return {
        next() {
          let result = { value: i, done: false };
          i += 1;
          return result;
        },

        return() {
          return { done: true };
        }
      };
    }
  };

  await expect(iterable).not.toBeCloseableAsyncIterator();
});
