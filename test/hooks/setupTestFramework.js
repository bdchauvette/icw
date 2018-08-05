expect.extend({
  toBeAsyncIterable,
  toBeFunction
});

async function toBeAsyncIterable(received /* , argument*/) {
  let createIterator = received[Symbol.asyncIterator];

  if (typeof createIterator !== "function") {
    return {
      message: () =>
        `expected ${received} to have a \`Symbol.asyncIterator\` method`,
      pass: false
    };
  }

  let iterator = createIterator.bind(received)();

  if (typeof iterator.next !== "function") {
    return {
      message: () =>
        `expected \`Symbol.asyncIterator\` return an object with a \`next\` method`,
      pass: false
    };
  }

  let pendingResult = iterator.next();

  if (!(pendingResult instanceof Promise)) {
    return {
      message: () => `expected \`next\` return a Promise`,
      pass: false
    };
  }

  let result = await pendingResult;

  if (!Reflect.has(result, "value")) {
    return {
      message: () => "expected result to have a `value` property",
      pass: false
    };
  }

  if (!Reflect.has(result, "done")) {
    return {
      message: () => "expected result to have a `done`",
      pass: false
    };
  }

  if (typeof result.done !== "boolean") {
    return {
      message: () => "expected `result.done` to be a boolean",
      pass: false
    };
  }

  return {
    message: () => `expected ${received} to be an async iterable`,
    pass: true
  };
}

function toBeFunction(received /*, argument*/) {
  return {
    message: () => `expected ${received} to be a function`,
    pass: typeof received === "function"
  };
}
