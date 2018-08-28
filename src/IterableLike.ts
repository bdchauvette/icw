export type IterableLike<T> =
  | AsyncIterable<T>
  | Iterable<T>
  | ArrayLike<T>
  | Promise<T>
  | PromiseLike<T>;
