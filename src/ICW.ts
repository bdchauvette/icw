// Static methods
import { from } from "./from";
import { of } from "./of";

// Prototype methods
import { consume } from "./consume";
import { filter } from "./filter";
import { map } from "./map";
import { reject } from "./reject";
import { scan } from "./scan";
import { withIndex } from "./withIndex";

const _iterable = Symbol("@icw/ICW/_iterable");

export class ICW<T> implements AsyncIterable<T> {
  static from<U>(
    input: AsyncIterable<U> | Iterable<U> | ArrayLike<U> | Promise<U>
  ): ICW<U> {
    return new ICW(from(input));
  }

  static of<U>(...items: U[]): ICW<U> {
    return new ICW(of(...items));
  }

  private [_iterable]: AsyncIterable<T> | Iterable<T>;

  constructor(iterable: AsyncIterable<T> | Iterable<T>) {
    this[_iterable] = iterable;
  }

  async *[Symbol.asyncIterator]() {
    return yield* this[_iterable];
  }

  consume(): Promise<void> {
    return consume(this);
  }

  filter(
    shouldInclude: (result: T, index?: number) => boolean | Promise<boolean>,
    thisArg?: any
  ): ICW<T> {
    return new ICW(filter(this, shouldInclude, thisArg));
  }

  map<U>(
    callbackFn: (result: T, index?: number) => U | Promise<U>,
    thisArg?: any
  ): ICW<U> {
    return new ICW(map(this, callbackFn, thisArg));
  }

  reject(
    shouldReject: (result: T, index?: number) => boolean | Promise<boolean>,
    thisArg?: any
  ): ICW<T> {
    return new ICW(reject(this, shouldReject, thisArg));
  }

  scan(
    accumulate: (accumulator: T, result: T, index?: number) => T | Promise<T>,
    initialValue?: T
  ): ICW<T> {
    let useFirstResultAsInitialValue = arguments.length < 2;

    return useFirstResultAsInitialValue
      ? new ICW(scan(this, accumulate))
      : new ICW(scan(this, accumulate, initialValue));
  }

  withIndex(): ICW<[T, number]> {
    return new ICW(withIndex(this));
  }
}
