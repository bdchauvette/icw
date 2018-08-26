import { isAsyncIterable } from "./__internal__/isAsyncIterable";
import { isIterable } from "./__internal__/isIterable";
import { isFunction } from "./__internal__/isFunction";

// Static methods
import { from } from "./from";
import { of } from "./of";

// Prototype methods
import { collect } from "./collect";
import { drain } from "./drain";
import { every } from "./every";
import { filter } from "./filter";
import { first } from "./first";
import { forEach } from "./forEach";
import { last } from "./last";
import { map } from "./map";
import { reduce } from "./reduce";
import { reject } from "./reject";
import { scan } from "./scan";
import { skip } from "./skip";
import { skipWhile } from "./skipWhile";
import { some } from "./some";
import { take } from "./take";
import { takeWhile } from "./takeWhile";
import { tap } from "./tap";
import { toArray } from "./toArray";
import { toPromise } from "./toPromise";
import { withIndex } from "./withIndex";
import { tail } from "./tail";

const _iterator = Symbol("@icw/ICW/_iterable");

export class ICW<T> implements AsyncIterableIterator<T> {
  static from<U>(
    input: AsyncIterable<U> | Iterable<U> | ArrayLike<U> | Promise<U>
  ): ICW<U> {
    return new ICW(from(input));
  }

  static of<U>(...items: U[]): ICW<U> {
    return new ICW(of(...items));
  }

  private [_iterator]: AsyncIterator<T> | Iterator<T>;

  constructor(iterable: AsyncIterable<T> | Iterable<T>) {
    if (isAsyncIterable(iterable)) {
      this[_iterator] = iterable[Symbol.asyncIterator]();
    } else if (isIterable(iterable)) {
      this[_iterator] = iterable[Symbol.iterator]();
    } else {
      throw new Error("First argument must implement the Iterable protocol");
    }
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    return this;
  }

  async next(value?: any): Promise<IteratorResult<T>> {
    return this[_iterator].next(value);
  }

  async return(value?: any): Promise<IteratorResult<T>> {
    return isFunction(this[_iterator].return)
      ? this[_iterator].return!(value)
      : (({ done: true, value: undefined } as any) as IteratorResult<T>);
  }

  async throw(error?: any): Promise<IteratorResult<T>> {
    if (isFunction(this[_iterator].throw)) {
      return this[_iterator].throw!(error);
    }

    throw error;
  }

  collect(): ICW<T[]> {
    return new ICW(collect(this));
  }

  drain(): Promise<void> {
    return drain(this);
  }

  every(
    isOK: (value: T, index?: number) => boolean | Promise<boolean>,
    thisArg?: any
  ): ICW<boolean> {
    return new ICW(every(this, isOK, thisArg));
  }

  filter(
    shouldInclude: (value: T, index?: number) => boolean | Promise<boolean>,
    thisArg?: any
  ): ICW<T> {
    return new ICW(filter(this, shouldInclude, thisArg));
  }

  first(): ICW<T> {
    return new ICW(first(this));
  }

  forEach(
    callback: (value: T, index?: number) => void | Promise<void>,
    thisArg?: any
  ): Promise<void> {
    return forEach(this, callback, thisArg);
  }

  head(): ICW<T> {
    return this.first();
  }

  last(): ICW<T> {
    return new ICW(last(this));
  }

  map<U>(
    callbackFn: (value: T, index?: number) => U | Promise<U>,
    thisArg?: any
  ): ICW<U> {
    return new ICW(map(this, callbackFn, thisArg));
  }

  reduce(
    ...args: [(accumulator: T, value: T, index?: number) => T | Promise<T>, T?]
  ): ICW<T> {
    return new ICW(reduce(this, ...args));
  }

  reject(
    shouldReject: (value: T, index?: number) => boolean | Promise<boolean>,
    thisArg?: any
  ): ICW<T> {
    return new ICW(reject(this, shouldReject, thisArg));
  }

  scan(
    accumulate: (accumulator: T, value: T, index?: number) => T | Promise<T>,
    initialValue?: T
  ): ICW<T> {
    let firstValueIsInitialAccumulator = arguments.length < 2;

    return firstValueIsInitialAccumulator
      ? new ICW(scan(this, accumulate))
      : new ICW(scan(this, accumulate, initialValue));
  }

  skip(numToSkip: number): ICW<T> {
    return new ICW(skip(this, numToSkip));
  }

  skipWhile(
    shouldSkip: (value: T, index?: number) => boolean | Promise<boolean>,
    thisArg?: any
  ): ICW<T> {
    return new ICW(skipWhile(this, shouldSkip, thisArg));
  }

  some(
    isOK: (value: T, index?: number) => boolean | Promise<boolean>,
    thisArg?: any
  ): ICW<boolean> {
    return new ICW(some(this, isOK, thisArg));
  }

  tail(): ICW<T> {
    return new ICW(tail(this));
  }

  take(numToTake: number): ICW<T> {
    return new ICW(take(this, numToTake));
  }

  takeWhile(
    shouldTake: (value: T, index?: number) => boolean | Promise<boolean>,
    thisArg?: any
  ): ICW<T> {
    return new ICW(takeWhile(this, shouldTake, thisArg));
  }

  tap(
    callback: (value: T, index?: number) => void | Promise<void>,
    thisArg?: any
  ): ICW<T> {
    return new ICW(tap(this, callback, thisArg));
  }

  toArray(): Promise<T[]> {
    return toArray(this);
  }

  toPromise(): Promise<T | undefined> {
    return toPromise(this);
  }

  withIndex(): ICW<[T, number]> {
    return new ICW(withIndex(this));
  }
}
