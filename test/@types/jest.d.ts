declare namespace jest {
  interface Matchers<R> {
    toBeCloseableAsyncIterator(): R;
    toReturnSameAsyncIterator(): R;
  }
}
