import { DelegatingAsyncIterable } from "./__internal__/DelegatingAsyncIterable";
import { of } from "./of";
import { from, FromInput } from "./from";
import { map } from "./map";
import { consume } from "./consume";
import { withIndex } from "./withIndex";

export class ICW<T> extends DelegatingAsyncIterable<T> {
  static from<U>(input: FromInput<U>): ICW<U> {
    return new ICW(from(input));
  }

  static of<U>(...items: U[]): ICW<U> {
    return new ICW(of(...items));
  }

  consume(): Promise<void> {
    return consume(this);
  }

  map<U>(
    callbackFn: (
      result: T,
      index?: number,
      iterable?: Iterable<T> | AsyncIterable<T>
    ) => U | Promise<U>,
    thisArg?: any
  ): ICW<U> {
    return new ICW(map(this, callbackFn, thisArg));
  }

  withIndex<T>(): ICW<[T, number]> {
    return new ICW(withIndex(this));
  }
}
