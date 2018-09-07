// plop: Imports
import { IterableLike } from "./IterableLike";
import { drain } from "./drain";
import { every } from "./every";
import { filter } from "./filter";
import { find } from "./find";
import { findIndex } from "./findIndex";
import { findLast } from "./findLast";
import { findLastIndex } from "./findLastIndex";
import { first } from "./first";
import { forEach } from "./forEach";
import { from } from "./from";
import { includes } from "./includes";
import { indexOf } from "./indexOf";
import { last } from "./last";
import { lastIndexOf } from "./lastIndexOf";
import { map } from "./map";
import { nth } from "./nth";
import { of } from "./of";
import { reduce } from "./reduce";
import { reject } from "./reject";
import { scan } from "./scan";
import { skip } from "./skip";
import { skipWhile } from "./skipWhile";
import { some } from "./some";
import { tail } from "./tail";
import { take } from "./take";
import { takeLast } from "./takeLast";
import { takeWhile } from "./takeWhile";
import { tap } from "./tap";
import { toArray } from "./toArray";
import { withIndex } from "./withIndex";
// plop-end

const _iterator = Symbol("_iterator");

export class ICW<T> implements AsyncIterableIterator<T> {
  // plop: Static methods

  static from<U>(iterableLike: IterableLike<U>): ICW<U> {
    return new ICW(iterableLike);
  }

  static of<U>(...items: U[]): ICW<U> {
    return new ICW(of(...items));
  }

  private [_iterator]: AsyncIterator<T>;

  constructor(iterableLike: IterableLike<T>) {
    this[_iterator] = from(iterableLike);
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    return this;
  }

  async next(value?: any): Promise<IteratorResult<T>> {
    return this[_iterator].next(value);
  }

  async return(value?: any): Promise<IteratorResult<T>> {
    return this[_iterator].return!(value);
  }

  async throw(error?: any): Promise<IteratorResult<T>> {
    return this[_iterator].throw!(error);
  }

  // plop: Prototype methods

  takeLast(numToTake: number): ICW<T> {
    return new ICW(takeLast(this, numToTake));
  }

  drain(): Promise<void> {
    return drain(this);
  }

  every(
    isOK: (value: T, index?: number) => boolean | Promise<boolean>,
    thisArg?: any
  ): Promise<boolean> {
    return every(this, isOK, thisArg);
  }

  filter(
    shouldInclude: (value: T, index?: number) => boolean | Promise<boolean>,
    thisArg?: any
  ): ICW<T> {
    return new ICW(filter(this, shouldInclude, thisArg));
  }

  find(
    predicate: (value: T, index?: number) => boolean | Promise<boolean>,
    thisArg?: any
  ): Promise<T | undefined> {
    return find(this, predicate, thisArg);
  }

  findIndex(
    predicate: (value: T, index?: number) => boolean | Promise<boolean>,
    thisArg?: any
  ): Promise<number> {
    return findIndex(this, predicate, thisArg);
  }

  findLast(
    predicate: (value: T, index?: number) => boolean | Promise<boolean>,
    thisArg?: any
  ): Promise<T | undefined> {
    return findLast(this, predicate, thisArg);
  }

  findLastIndex(
    predicate: (value: T, index?: number) => boolean | Promise<boolean>,
    thisArg?: any
  ): Promise<number> {
    return findLastIndex(this, predicate, thisArg);
  }

  first(): Promise<T | undefined> {
    return first(this);
  }

  forEach(
    callback: (value: T, index?: number) => void | Promise<void>,
    thisArg?: any
  ): Promise<void> {
    return forEach(this, callback, thisArg);
  }

  head(): Promise<T | undefined> {
    return this.first();
  }

  includes(targetValue: T): Promise<boolean> {
    return includes(this, targetValue);
  }

  indexOf(targetValue: T, fromIndex = 0): Promise<number> {
    return indexOf(this, targetValue, fromIndex);
  }

  last(): Promise<T | undefined> {
    return last(this);
  }

  lastIndexOf(targetValue: T, fromIndex = 0): Promise<number> {
    return lastIndexOf(this, targetValue, fromIndex);
  }

  map<U>(
    callbackFn: (value: T, index?: number) => U | Promise<U>,
    thisArg?: any
  ): ICW<U> {
    return new ICW(map(this, callbackFn, thisArg));
  }

  nth(index: number): Promise<T | undefined> {
    return nth(this, index);
  }

  reduce<R>(
    ...args: [(accumulator: R, value: T, index?: number) => R | Promise<R>, R?]
  ): Promise<R> {
    return reduce(this, ...args);
  }

  reject(
    shouldReject: (value: T, index?: number) => boolean | Promise<boolean>,
    thisArg?: any
  ): ICW<T> {
    return new ICW(reject(this, shouldReject, thisArg));
  }

  scan<R>(
    ...args: [(accumulator: R, value: T, index?: number) => R | Promise<R>, R?]
  ): ICW<R> {
    return new ICW(scan(this, ...args));
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
  ): Promise<boolean> {
    return some(this, isOK, thisArg);
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

  withIndex(): ICW<[T, number]> {
    return new ICW(withIndex(this));
  }
}
