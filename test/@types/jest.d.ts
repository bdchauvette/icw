declare namespace jest {
  interface Matchers<R> {
    toReturnSameAsyncIterator(): R;
  }
}
