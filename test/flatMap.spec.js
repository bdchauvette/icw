import { flatMap } from "../src/flatMap";

import { drain } from "../src/drain";
import { of } from "../src/of";
import { ArrayLike } from "./helpers/ArrayLike";
import { toUpperCase } from "./helpers/toUpperCase";
import { toUpperCaseSync } from "./helpers/toUpperCaseSync";

test("rejects on non-IterableLike input", async () => {
  expect.assertions(2);
  try {
    await flatMap(null, toUpperCase).next();
  } catch (error) {
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toMatchInlineSnapshot(
      `"Must provide an iterable, async iterable, Array-like value, or a Promise."`
    );
  }
});

test("returns same async iterator", () => {
  expect.assertions(1);
  expect(flatMap(of(), v => of(v))).toReturnSameAsyncIterator();
});

test("returns a closeable iterator", async () => {
  expect.assertions(1);
  await expect(flatMap(of(), v => of(v))).toBeCloseableAsyncIterator();
});

test("lazily consumes provided IterableLike input", async () => {
  expect.assertions(1);
  await expect(_ =>
    flatMap(_, v => of(v))
  ).toLazilyConsumeWrappedAsyncIterable();
});

test("calls callback with 2 arguments", async () => {
  expect.assertions(1);

  await drain(
    flatMap(of("foo"), (...args) => {
      expect(args).toHaveLength(2);
    })
  );
});

test("provides current value as first argument to callback", async () => {
  expect.assertions(3);

  let input = of("foo", "bar", "baz");
  let expectedValues = ["foo", "bar", "baz"];

  await drain(
    flatMap(input, value => {
      expect(value).toStrictEqual(expectedValues.shift());
    })
  );
});

test("provides current index as second argument to callback", async () => {
  expect.assertions(3);

  let input = of("foo", "bar", "baz");
  let expectedIndexes = [0, 1, 2];

  await drain(
    flatMap(input, (_, index) => {
      expect(index).toStrictEqual(expectedIndexes.shift());
    })
  );
});

test("calls callback with an `undefined` `this`-context by default", async () => {
  expect.assertions(1);
  await drain(flatMap(of("foo"), testCallback));

  function testCallback() {
    expect(this).toBeUndefined();
  }
});

test("calls callback with the `this`-context provided by `thisArg` argument", async () => {
  expect.assertions(1);
  let expectedThis = {};
  await drain(flatMap(of("foo"), testCallback, expectedThis));

  function testCallback() {
    expect(this).toBe(expectedThis);
  }
});

describe.each`
  callbackType | callback
  ${"async"}   | ${async n => [n * 2, n ** 2]}
  ${"sync"}    | ${n => [n * 2, n ** 2]}
`("$callbackType callback", async ({ callback }) => {
  test.each`
    inputType          | iterableLike              | expectedValues
    ${"AsyncIterable"} | ${of(1, 2, 3)}            | ${[2, 1, 4, 4, 6, 9]}
    ${"Iterable"}      | ${[1, 2, 3]}              | ${[2, 1, 4, 4, 6, 9]}
    ${"ArrayLike"}     | ${new ArrayLike(1, 2, 3)} | ${[2, 1, 4, 4, 6, 9]}
    ${"Promise"}       | ${Promise.resolve(1)}     | ${[2, 1]}
  `(
    "maps and flattens input one level deep",
    async ({ iterableLike, expectedValues }) => {
      expect.assertions(expectedValues.length);
      for await (let value of flatMap(iterableLike, callback)) {
        expect(value).toStrictEqual(expectedValues.shift());
      }
    }
  );
});

describe.each`
  callbackType | callback
  ${"async"}   | ${toUpperCase}
  ${"sync"}    | ${toUpperCaseSync}
`("$callbackType callback", async ({ callback }) => {
  test.each`
    inputType          | iterableLike              | expectedValues
    ${"AsyncIterable"} | ${of("foo")}              | ${["FOO"]}
    ${"Iterable"}      | ${["foo"]}                | ${["FOO"]}
    ${"ArrayLike"}     | ${new ArrayLike("foo")}   | ${["FOO"]}
    ${"Promise"}       | ${Promise.resolve("foo")} | ${["FOO"]}
  `(
    "maps strings as a single value",
    async ({ iterableLike, expectedValues }) => {
      expect.assertions(expectedValues.length);
      for await (let value of flatMap(iterableLike, callback)) {
        expect(value).toStrictEqual(expectedValues.shift());
      }
    }
  );
});
