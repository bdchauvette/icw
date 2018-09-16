import { every } from "../src/every";

import { of } from "../src/of";
import { isTruthy } from "./helpers/isTruthy";
import { isTruthySync } from "./helpers/isTruthySync";
import { ArrayLike } from "./helpers/ArrayLike";

test("eagerly consumes wrapped IterableLike input", async () => {
  expect.assertions(1);
  await expect(_ => every(_, isTruthy)).toEagerlyConsumeWrappedAsyncIterable();
});

test("calls callback with 2 arguments", async () => {
  expect.assertions(1);
  await every(of(true), (...args) => {
    expect(args).toHaveLength(2);
  });
});

test("provides current value as first argument to callback", async () => {
  expect.assertions(3);

  let input = of("foo", "bar", "baz");
  let expectedValues = ["foo", "bar", "baz"];

  await every(input, value => {
    expect(value).toStrictEqual(expectedValues.shift());
    return true;
  });
});

test("provides current index as second argument to callback", async () => {
  expect.assertions(3);

  let input = of("foo", "bar", "baz");
  let expectedIndexes = [0, 1, 2];

  await every(input, (_, index) => {
    expect(index).toStrictEqual(expectedIndexes.shift());
    return true;
  });
});

test("calls callback with an `undefined` `this`-context by default", async () => {
  expect.assertions(1);
  await every(of("foo"), testCallback);

  function testCallback() {
    expect(this).toBeUndefined();
  }
});

test("calls callback with the `this`-context provided by `thisArg` argument", async () => {
  expect.assertions(1);
  let expectedThis = {};
  await every(of("foo"), testCallback, expectedThis);

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
    inputType          | iterableLike
    ${"AsyncIterable"} | ${of(true, true, true)}
    ${"Iterable"}      | ${[true, true, true]}
    ${"ArrayLike"}     | ${new ArrayLike(true, true, true)}
    ${"Promise"}       | ${Promise.resolve(true)}
  `(
    "returns `Promise<true>` when predicate returns true for *every* item of $inputType input",
    async ({ iterableLike }) => {
      expect.assertions(1);
      await expect(every(iterableLike, callback)).resolves.toBe(true);
    }
  );

  test.each`
    inputType          | iterableLike
    ${"AsyncIterable"} | ${of(true, true, false)}
    ${"Iterable"}      | ${[true, true, false]}
    ${"ArrayLike"}     | ${new ArrayLike(true, true, false)}
    ${"Promise"}       | ${Promise.resolve(false)}
  `(
    "returns `Promise<false>` when predicate returns false for *any* item of $inputType input",
    async ({ iterableLike }) => {
      expect.assertions(1);
      await expect(every(iterableLike, callback)).resolves.toBe(false);
    }
  );
});
