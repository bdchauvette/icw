import { of } from "./of";
import { from, FromInput } from "./from";
import { AsyncDelegator } from "./__internal__/AsyncDelegator";

export class ICW<T> extends AsyncDelegator<T> {
  static from<U>(input: FromInput<U>): ICW<U> {
    return new ICW(from(input));
  }

  static of<U>(...items: U[]): ICW<U> {
    return new ICW(of(...items));
  }
}
