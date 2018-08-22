exports.toBeCloseableAsyncIterator = async function toBeCloseableAsyncIterator(
  received
) {
  let iterator = received[Symbol.asyncIterator]();

  if (typeof iterator.return !== "function") {
    return {
      message: () => `expected ${received} to have a \`return\` method`,
      pass: false
    };
  }

  await iterator.return();
  let { done } = await iterator.next();

  if (!done) {
    return {
      message: () =>
        `expected ${received} to be closed after calling its \`return\` method`,
      pass: false
    };
  }

  return {
    message: () => `expected ${received} to return a closeable async iterator`,
    pass: true
  };
};
