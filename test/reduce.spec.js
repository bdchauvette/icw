import { reduce } from "../src/reduce";

import { of } from "../src/of";
import { sum } from "./helpers/sum";
import { sumSync } from "./helpers/sumSync";
import { ArrayLike } from "./helpers/ArrayLike";

test("rejects on non-IterableLike input", async () => {
  expect.assertions(2);
  try {
    await reduce(null);
  } catch (error) {
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toMatchInlineSnapshot(
      `"Must provide an iterable, async iterable, Array-like value, or a Promise."`
    );
  }
});

test("eagerly consumes wrapped IterableLike input", async () => {
  expect.assertions(1);
  await expect(_ => reduce(_, sum)).toEagerlyConsumeWrappedAsyncIterable();
});

test("call callback with 3 arguments", async () => {
  expect.assertions(1);
  await reduce(of(true), (...args) => {
    expect(args).toHaveLength(3);
  });
});

test("provides accumulator as first argument to callback", async () => {
  expect.assertions(3);

  let input = of(1, 2, 3);
  let expectedAccumulators = [0, 1, 3];
  let testCallback = jest.fn(sum);

  await reduce(input, testCallback, 0);

  testCallback.mock.calls.forEach((mockCall, index) => {
    expect(mockCall[0]).toStrictEqual(expectedAccumulators[index]);
  });
});

test("uses provided seed as first accumulator", async () => {
  expect.assertions(1);

  let seed = "seed";
  let input = of("foo");

  await reduce(input, testCallback, seed);

  function testCallback(accumulator) {
    expect(accumulator).toStrictEqual(seed);
  }
});

test("uses `undefined` as first accumulator if seed is explicitly set to `undefined`", async () => {
  expect.assertions(1);

  let input = of("foo");

  await reduce(input, testCallback, undefined);

  function testCallback(accumulator) {
    expect(accumulator).toBeUndefined();
  }
});

test("uses first value as first accumulator if seed is not provided", async () => {
  expect.assertions(1);

  let input = of("foo");

  await reduce(input, testCallback);

  function testCallback(accumulator) {
    expect(accumulator).toStrictEqual("foo");
  }
});

test("provides current value as second argument to callback", async () => {
  expect.assertions(3);

  let input = of("foo", "bar", "baz");
  let expectedValues = ["foo", "bar", "baz"];

  await reduce(input, (_, value) => {
    expect(value).toStrictEqual(expectedValues.shift());
  });
});

test("provides current index as third argument to callback", async () => {
  expect.assertions(3);

  let input = of("foo", "bar", "baz");
  let expectedIndexes = [0, 1, 2];

  await reduce(input, (_, __, value) => {
    expect(value).toStrictEqual(expectedIndexes.shift());
  });
});

describe.each`
  callbackType | callback
  ${"async"}   | ${sum}
  ${"sync"}    | ${sumSync}
`("$callbackType callback", ({ callback }) => {
  test.each`
    inputType          | iterableLike              | expectedValue
    ${"AsyncIterable"} | ${of(1, 2, 3)}            | ${6}
    ${"Iterable"}      | ${[1, 2, 3]}              | ${6}
    ${"ArrayLike"}     | ${new ArrayLike(1, 2, 3)} | ${6}
    ${"Promise"}       | ${Promise.resolve(1)}     | ${1}
  `(
    "resolves to accumulated value of $inputType input",
    async ({ iterableLike, expectedValue }) => {
      expect.assertions(1);
      await expect(reduce(iterableLike, callback, 0)).resolves.toStrictEqual(
        expectedValue
      );
    }
  );
});
