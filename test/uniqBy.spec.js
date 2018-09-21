import { uniqBy } from "../src/uniqBy";

import { drain } from "../src/drain";
import { of } from "../src/of";
import { ArrayLike } from "./helpers/ArrayLike";
import { toUpperCase } from "./helpers/toUpperCase";
import { toUpperCaseSync } from "./helpers/toUpperCaseSync";

test("rejects on non-IterableLike input", async () => {
  expect.assertions(2);
  try {
    await uniqBy(null).next();
  } catch (error) {
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toMatchInlineSnapshot(
      `"Must provide an iterable, async iterable, Array-like value, or a Promise."`
    );
  }
});

test("returns same async iterator", () => {
  expect.assertions(1);
  expect(uniqBy(of(), toUpperCase)).toReturnSameAsyncIterator();
});

test("returns a closeable iterator", async () => {
  expect.assertions(1);
  await expect(uniqBy(of(), toUpperCase)).toBeCloseableAsyncIterator();
});

test("lazily consumes provided IterableLike input", async () => {
  expect.assertions(1);
  await expect(_ =>
    uniqBy(_, toUpperCase)
  ).toLazilyConsumeWrappedAsyncIterable();
});

test("calls callback with 1 argument", async () => {
  expect.assertions(1);

  await drain(
    uniqBy(of("foo"), (...args) => {
      expect(args).toHaveLength(1);
    })
  );
});

test("provides current value as first argument to callback", async () => {
  expect.assertions(3);

  let input = of("foo", "bar", "baz");
  let expectedValues = ["foo", "bar", "baz"];

  await drain(
    uniqBy(input, value => {
      expect(value).toStrictEqual(expectedValues.shift());
    })
  );
});

test("calls callback with an `undefined` `this`-context by default", async () => {
  expect.assertions(1);
  await drain(uniqBy(of("foo"), testCallback));

  function testCallback() {
    expect(this).toBeUndefined();
  }
});

test("calls callback with the `this`-context provided by `thisArg` argument", async () => {
  expect.assertions(1);
  let expectedThis = {};
  await drain(uniqBy(of("foo"), testCallback, expectedThis));

  function testCallback() {
    expect(this).toBe(expectedThis);
  }
});

describe.each`
  callbackType | callback
  ${"async"}   | ${toUpperCase}
  ${"sync"}    | ${toUpperCaseSync}
`("$callbackType callback", async ({ callback }) => {
  test.each`
    inputType          | iterableLike                                 | expectedValues
    ${"AsyncIterable"} | ${of("foo", "FOO", "bar", "BAR")}            | ${["foo", "bar"]}
    ${"Iterable"}      | ${["foo", "FOO", "bar", "BAR"]}              | ${["foo", "bar"]}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "FOO", "bar", "BAR")} | ${["foo", "bar"]}
    ${"Promise"}       | ${Promise.resolve("foo")}                    | ${["foo"]}
  `(
    "only yields unique values according to callback",
    async ({ iterableLike, expectedValues }) => {
      expect.assertions(expectedValues.length);
      for await (let value of uniqBy(iterableLike, callback)) {
        expect(value).toStrictEqual(expectedValues.shift());
      }
    }
  );
});
