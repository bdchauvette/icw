import { isFunction } from "./__internal__/isFunction";

export function pipeline<A extends any[], B>(
  fn: (...args: A) => B
): (...args: A) => B;

export function pipeline<A extends any[], B, C>(
  ...fns: [(...args: A) => B, (b: B) => C]
): (...args: A) => C;

export function pipeline<A extends any[], B, C, D>(
  ...fns: [(...args: A) => B, (b: B) => C, (c: C) => D]
): (...args: A) => D;

export function pipeline<A extends any[], B, C, D, E>(
  ...fns: [(...args: A) => B, (b: B) => C, (c: C) => D, (d: D) => E]
): (...args: A) => E;

export function pipeline<A extends any[], B, C, D, E, F>(
  ...fns: [
    (...args: A) => B,
    (b: B) => C,
    (c: C) => D,
    (d: D) => E,
    (e: E) => F
  ]
): (...args: A) => F;

export function pipeline<A extends any[], B, C, D, E, F, G>(
  ...fns: [
    (...args: A) => B,
    (b: B) => C,
    (c: C) => D,
    (d: D) => E,
    (e: E) => F,
    (f: F) => G
  ]
): (...args: A) => G;

export function pipeline<A extends any[], B, C, D, E, F, G, H>(
  ...fns: [
    (...args: A) => B,
    (b: B) => C,
    (c: C) => D,
    (d: D) => E,
    (e: E) => F,
    (f: F) => G,
    (g: G) => H
  ]
): (...args: A) => H;

export function pipeline<A extends any[], B, C, D, E, F, G, H, I>(
  ...fns: [
    (...args: A) => B,
    (b: B) => C,
    (c: C) => D,
    (d: D) => E,
    (e: E) => F,
    (f: F) => G,
    (g: G) => H,
    (h: H) => I
  ]
): (...args: A) => I;

export function pipeline<A extends any[], B, C, D, E, F, G, H, I, J>(
  ...fns: [
    (...args: A) => B,
    (b: B) => C,
    (c: C) => D,
    (d: D) => E,
    (e: E) => F,
    (f: F) => G,
    (g: G) => H,
    (h: H) => I,
    (i: I) => J
  ]
): (...args: A) => J;

export function pipeline<A extends any[], B, C, D, E, F, G, H, I, J, K>(
  ...fns: [
    (...args: A) => B,
    (b: B) => C,
    (c: C) => D,
    (d: D) => E,
    (e: E) => F,
    (f: F) => G,
    (g: G) => H,
    (h: H) => I,
    (i: I) => J,
    (j: J) => K
  ]
): (...args: A) => K;

export function pipeline<A extends any[], B, C, D, E, F, G, H, I, J, K, L>(
  ...fns: [
    (...args: A) => B,
    (b: B) => C,
    (c: C) => D,
    (d: D) => E,
    (e: E) => F,
    (f: F) => G,
    (g: G) => H,
    (h: H) => I,
    (i: I) => J,
    (j: J) => K,
    (k: K) => L
  ]
): (...args: A) => L;

export function pipeline<A extends any[], B, C, D, E, F, G, H, I, J, K, L, M>(
  ...fns: [
    (...args: A) => B,
    (b: B) => C,
    (c: C) => D,
    (d: D) => E,
    (e: E) => F,
    (f: F) => G,
    (g: G) => H,
    (h: H) => I,
    (i: I) => J,
    (j: J) => K,
    (k: K) => L,
    (l: L) => M
  ]
): (...args: A) => M;

export function pipeline<A extends any[], R = any>(
  ...fns: ((...args: any[]) => any)[]
): (...args: A) => R;

export function pipeline<A extends any[], R = any>(
  fn1: (...args: A) => any,
  ...fns: Function[]
): (...args: A) => R {
  [fn1, ...fns].forEach(
    (fn, index): void => {
      if (!isFunction(fn)) {
        throw new TypeError(`Argument ${index} is not a function`);
      }
    }
  );

  return function runPipeline(...args: A): R {
    let result = fn1(...args);
    for (let fn of fns) result = fn(result);
    return result;
  };
}
