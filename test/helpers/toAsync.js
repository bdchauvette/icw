export function toAsync(fn) {
  return async function asyncFn(...args) {
    return fn.call(this, ...args);
  };
}
