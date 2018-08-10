export function runDrainSuite(drain: Function) {
  test("returns a Promise", async () => {
    expect.assertions(1);
    expect(drain([])).toBeInstanceOf(Promise);
  });

  test("eagerly consumes the provided iterable", async () => {
    expect.assertions(1);
    let next = jest.fn(() => ({ done: true }));
    let iterable = { [Symbol.iterator]: () => ({ next }) };

    await drain(iterable);
    expect(next).toHaveBeenCalled();
  });

  test("runs the provided iterable to completion", async () => {
    expect.assertions(2);
    let tick = jest.fn();

    let iterations = 3;
    let result = await drain(createConsumableIterable(iterations, tick));

    expect(result).toBeUndefined();
    expect(tick).toHaveBeenCalledTimes(iterations);
  });

  test("runs the provided async iterable to completion", async () => {
    expect.assertions(2);
    let tick = jest.fn();

    let iterations = 3;
    let result = await drain(createConsumableAsyncIterable(iterations, tick));

    expect(result).toBeUndefined();
    expect(tick).toHaveBeenCalledTimes(iterations);
  });
}

function createConsumableIterable(
  maxIterations: number,
  tick: jest.Mock<any>
): Iterable<void> {
  return {
    [Symbol.iterator]() {
      let iteration = 0;
      return {
        next() {
          iteration += 1;
          let result = { value: undefined, done: iteration >= maxIterations };

          tick();
          return result;
        }
      };
    }
  };
}

function createConsumableAsyncIterable(
  maxIterations: number,
  tick: jest.Mock<any>
): AsyncIterable<void> {
  return {
    [Symbol.asyncIterator]() {
      let iteration = 0;
      return {
        async next() {
          iteration += 1;
          let result = { value: undefined, done: iteration >= maxIterations };

          tick();
          return result;
        }
      };
    }
  };
}
