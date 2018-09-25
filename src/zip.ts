import { toIterable } from "./__internal__/toIterable";
import { IterableLike } from "./IterableLike";
import { isAsyncIterable } from "./__internal__/isAsyncIterable";
import { isFunction } from "./__internal__/isFunction";

export function zip<T>(
  ...iterableLikes: IterableLike<T>[]
): AsyncIterableIterator<T[]> {
  let iterators = iterableLikes.map(iterableLike => {
    let iterable = toIterable(iterableLike);

    return isAsyncIterable<T>(iterable)
      ? iterable[Symbol.asyncIterator]()
      : iterable[Symbol.iterator]();
  });

  let done = false;

  return {
    [Symbol.asyncIterator](): AsyncIterableIterator<T[]> {
      return this;
    },

    async next(): Promise<IteratorResult<T[]>> {
      if (!done) {
        let results = await Promise.all(
          iterators.map(iterable => iterable.next())
        );

        done = isSomeIteratorDone(results);

        if (done) {
          await closeAll(iterators);
        } else {
          return {
            value: results.map(({ value }) => value),
            done: false
          };
        }
      }

      return ({
        value: undefined,
        done: true
      } as any) as IteratorResult<T[]>;
    },

    async return(): Promise<IteratorResult<T[]>> {
      done = true;
      await closeAll(iterators);
      return ({
        value: undefined,
        done: true
      } as any) as IteratorResult<T[]>;
    },

    async throw(error: any): Promise<IteratorResult<T[]>> {
      done = true;
      await closeAll(iterators);
      throw error;
    }
  };
}

function isSomeIteratorDone<T>(results: IteratorResult<T>[]): boolean {
  return results.some(({ done }) => done);
}

async function closeAll<T>(
  iterators: (AsyncIterator<T> | Iterator<T>)[]
): Promise<IteratorResult<T>[]> {
  return Promise.all(
    iterators
      .filter(iterator => isFunction(iterator.return))
      .map(iterator => iterator.return!())
  );
}
