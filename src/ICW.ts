import { DelegatingAsyncIterable } from "./__internal__/DelegatingAsyncIterable";

// Static methods
import { from, FromInput } from "./from";
import { of } from "./of";

// Prototype methods
import { consume } from "./consume";
import { filter, FilterCallback } from "./filter";
import { map, MapCallback } from "./map";
import { reject } from "./reject";
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

  filter<TH>(shouldInclude: FilterCallback<T, TH>, thisArg?: TH): ICW<T> {
    return new ICW(filter<T, TH>(this, shouldInclude, thisArg));
  }

  map<U, TH>(callbackFn: MapCallback<T, U, TH>, thisArg?: TH): ICW<U> {
    return new ICW(map(this, callbackFn, thisArg));
  }

  reject<TH>(shouldReject: FilterCallback<T, TH>, thisArg?: TH): ICW<T> {
    return new ICW(reject<T, TH>(this, shouldReject, thisArg));
  }

  withIndex<T>(): ICW<[T, number]> {
    return new ICW(withIndex(this));
  }
}
