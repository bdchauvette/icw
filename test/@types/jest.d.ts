declare namespace jest {
  interface Matchers<R> {
    toBeAsyncIterable(): R;
    toBeFunction(): R;
  }
}
