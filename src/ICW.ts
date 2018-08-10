import { AnyIterable } from "./types";

// Static methods
import { from } from "./from";
import { of } from "./of";

// Prototype methods
import { consume } from "./consume";
import { filter, FilterCallback } from "./filter";
import { map, MapCallback } from "./map";
import { reject } from "./reject";
import { scan, ScanCallback } from "./scan";
import { withIndex } from "./withIndex";

const _iterable = Symbol("@icw/ICW/_iterable");

export class ICW<T> implements AsyncIterable<T> {
  static from<U>(input: AnyIterable<U> | ArrayLike<U> | Promise<U>): ICW<U> {
    return new ICW(from(input));
  }

  static of<U>(...items: U[]): ICW<U> {
    return new ICW(of(...items));
  }

  private [_iterable]: AnyIterable<T>;

  constructor(iterable: AnyIterable<T>) {
    this[_iterable] = iterable;
  }

  async *[Symbol.asyncIterator]() {
    return yield* this[_iterable];
  }

  consume(): Promise<void> {
    return consume(this);
  }

  filter<TH>(shouldInclude: FilterCallback<T, TH>, thisArg?: TH): ICW<T> {
    return new ICW(filter<T, TH>(this, shouldInclude, thisArg));
  }

  map<U, TH>(callbackFn: MapCallback<T, U, TH>, thisArg?: TH): ICW<U> {
    return new ICW(map<T, U, TH>(this, callbackFn, thisArg));
  }

  reject<TH>(shouldReject: FilterCallback<T, TH>, thisArg?: TH): ICW<T> {
    return new ICW(reject<T, TH>(this, shouldReject, thisArg));
  }

  scan(accumulate: ScanCallback<T>, initialValue?: T): ICW<T> {
    let useFirstResultAsInitialValue = arguments.length < 2;

    return useFirstResultAsInitialValue
      ? new ICW(scan(this, accumulate))
      : new ICW(scan(this, accumulate, initialValue));
  }

  withIndex(): ICW<[T, number]> {
    return new ICW(withIndex(this));
  }
}
