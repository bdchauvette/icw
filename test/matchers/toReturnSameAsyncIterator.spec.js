test("passes when iterable returns same async iterator", () => {
  expect.assertions(1);

  let sameIteratorFactory = {
    [Symbol.asyncIterator]() {
      return this;
    },

    next() {
      return { done: true };
    }
  };

  expect(sameIteratorFactory).toReturnSameAsyncIterator();
});

test("fails when iterable returns different async iterator", () => {
  expect.assertions(1);

  let differentIteratorFactory = {
    [Symbol.asyncIterator]() {
      return {
        next() {
          return { done: true };
        }
      };
    }
  };

  expect(differentIteratorFactory).not.toReturnSameAsyncIterator();
});
