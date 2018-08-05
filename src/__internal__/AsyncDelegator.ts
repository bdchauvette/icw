const _iterable = Symbol("_iterable");

/**
 * An async iterable that delegates iteration to the provided iterable.
 */
export class AsyncDelegator<T> implements AsyncIterable<T> {
  private [_iterable]: Iterable<T> | AsyncIterable<T>;

  constructor(iterable: Iterable<T> | AsyncIterable<T>) {
    this[_iterable] = iterable;
  }

  async *[Symbol.asyncIterator]() {
    return yield* this[_iterable];
  }
}
