declare namespace jest {
  interface Matchers<R> {
    toBeCloseableAsyncIterator(): R;
    toEagerlyConsumeWrappedAsyncIterable(): R;
    toEagerlyConsumeWrappedIterable(): R;
    toLazilyConsumeWrappedAsyncIterable(): R;
    toLazilyConsumeWrappedIterable(): R;
    toReturnSameAsyncIterator(): R;
  }
}
