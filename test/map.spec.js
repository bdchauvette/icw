import { map } from "../src/map";

import { drain } from "../src/drain";
import { of } from "../src/of";
import { toUpperCase } from "./helpers/toUpperCase";
import { toUpperCaseSync } from "./helpers/toUpperCaseSync";
import { ArrayLike } from "./helpers/ArrayLike";

test("rejects on non-IterableLike input", async () => {
  expect.assertions(2);
  try {
    await map(null, toUpperCase).next();
  } catch (error) {
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toMatchInlineSnapshot(
      `"Must provide an iterable, async iterable, Array-like value, or a Promise."`
    );
  }
});

test("returns same async iterator", () => {
  expect.assertions(1);
  expect(map(of(), toUpperCase)).toReturnSameAsyncIterator();
});

test("returns a closeable iterator", async () => {
  expect.assertions(1);
  await expect(map(of(), toUpperCase)).toBeCloseableAsyncIterator();
});

test("lazily consumes provided IterableLike input", async () => {
  expect.assertions(1);
  await expect(_ => map(_, toUpperCase)).toLazilyConsumeWrappedAsyncIterable();
});

test("calls callback with 2 arguments", async () => {
  expect.assertions(1);
  await drain(
    map(of(true), (...args) => {
      expect(args).toHaveLength(2);
    })
  );
});

test("provides current value as first argument to callback", async () => {
  expect.assertions(3);

  let input = of(true, false, true);
  let expectedValues = [true, false, true];

  await drain(
    map(input, value => {
      expect(value).toStrictEqual(expectedValues.shift());
    })
  );
});

test("provides current index as second argument to callback", async () => {
  expect.assertions(3);

  let input = of(true, false, true);
  let expectedIndexes = [0, 1, 2];

  await drain(
    map(input, (_, index) => {
      expect(index).toStrictEqual(expectedIndexes.shift());
    })
  );
});

test("calls callback with an `undefined` `this`-context by default", async () => {
  expect.assertions(1);
  await drain(map(of("foo"), testCallback));

  function testCallback() {
    expect(this).toBeUndefined();
  }
});

test("calls callback with the `this`-context provided by `thisArg` argument", async () => {
  expect.assertions(1);
  let expectedThis = {};
  await drain(map(of("foo"), testCallback, expectedThis));

  function testCallback() {
    expect(this).toBe(expectedThis);
  }
});

describe.each`
  callbackType | callback
  ${"async"}   | ${toUpperCase}
  ${"sync"}    | ${toUpperCaseSync}
`("$callbackType callback", ({ callback }) => {
  test.each`
    inputType          | iterableLike                          | expectedValues
    ${"AsyncIterable"} | ${of("foo", "bar", "baz")}            | ${["FOO", "BAR", "BAZ"]}
    ${"Iterable"}      | ${["foo", "bar", "baz"]}              | ${["FOO", "BAR", "BAZ"]}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")} | ${["FOO", "BAR", "BAZ"]}
    ${"Promise"}       | ${Promise.resolve("foo")}             | ${["FOO"]}
  `(
    "yields each mapped items from $inputType input",
    async ({ iterableLike, expectedValues }) => {
      expect.assertions(expectedValues.length);
      for await (let value of map(iterableLike, callback)) {
        expect(value).toStrictEqual(expectedValues.shift());
      }
    }
  );
});
