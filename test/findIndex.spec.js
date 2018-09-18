import { findIndex } from "../src/findIndex";

import { of } from "../src/of";
import { ArrayLike } from "./helpers/ArrayLike";
import { isTruthy } from "./helpers/isTruthy";
import { isTruthySync } from "./helpers/isTruthySync";

test("rejects on non-IterableLike input", async () => {
  expect.assertions(2);
  try {
    await findIndex(null);
  } catch (error) {
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toMatchInlineSnapshot(
      `"Must provide an iterable, async iterable, Array-like value, or a Promise."`
    );
  }
});

test("eagerly consumes wrapped IterableLike input", async () => {
  expect.assertions(1);
  await expect(_ =>
    findIndex(_, isTruthy)
  ).toEagerlyConsumeWrappedAsyncIterable();
});

test("calls callback with 2 arguments", async () => {
  expect.assertions(1);
  await findIndex(of("foo"), (...args) => {
    expect(args).toHaveLength(2);
  });
});

test("provides current value as first argument to callback", async () => {
  expect.assertions(3);

  let input = of("foo", "bar", "baz");
  let expectedValues = ["foo", "bar", "baz"];

  await findIndex(input, value => {
    expect(value).toStrictEqual(expectedValues.shift());
  });
});

test("provides current index as second argument to callback", async () => {
  expect.assertions(3);

  let input = of("foo", "bar", "baz");
  let expectedIndexes = [0, 1, 2];

  await findIndex(input, (_, index) => {
    expect(index).toStrictEqual(expectedIndexes.shift());
  });
});

test("calls callback with an `undefined` `this`-context by default", async () => {
  expect.assertions(1);
  await findIndex(of("foo"), testCallback);

  function testCallback() {
    expect(this).toBeUndefined();
  }
});

test("calls callback with the `this`-context provided by `thisArg` argument", async () => {
  expect.assertions(1);
  let expectedThis = {};
  await findIndex(of("foo"), testCallback, expectedThis);

  function testCallback() {
    expect(this).toBe(expectedThis);
  }
});

describe.each`
  callbackType | callback
  ${"async"}   | ${isTruthy}
  ${"sync"}    | ${isTruthySync}
`("$callbackType callback", async ({ callback }) => {
  test.each`
    inputType          | iterableLike                         | expectedValue
    ${"AsyncIterable"} | ${of(false, false, true)}            | ${2}
    ${"Iterable"}      | ${[false, false, true]}              | ${2}
    ${"ArrayLike"}     | ${new ArrayLike(false, false, true)} | ${2}
    ${"Promise"}       | ${Promise.resolve(true)}             | ${0}
  `(
    "returns Promise containing the first value from $inputType input that satisfies the predicate",
    async ({ iterableLike, expectedValue }) => {
      expect.assertions(1);
      await expect(findIndex(iterableLike, callback)).resolves.toStrictEqual(
        expectedValue
      );
    }
  );

  test.each`
    inputType          | iterableLike
    ${"AsyncIterable"} | ${of(false, false, false)}
    ${"Iterable"}      | ${[false, false, false]}
    ${"ArrayLike"}     | ${new ArrayLike(false, false, false)}
    ${"Promise"}       | ${Promise.resolve(false)}
  `(
    "returns Promise<-1> if no value in $inputType input satisfies the predicate",
    async ({ iterableLike }) => {
      expect.assertions(1);
      await expect(findIndex(iterableLike, callback)).resolves.toStrictEqual(
        -1
      );
    }
  );
});
