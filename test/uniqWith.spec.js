import { uniqWith } from "../src/uniqWith";

import { drain } from "../src/drain";
import { of } from "../src/of";
import { ArrayLike } from "./helpers/ArrayLike";

async function isStringEqual(a, b) {
  return String(a) === String(b);
}

function isStringEqualSync(a, b) {
  return String(a) === String(b);
}

test("rejects on non-IterableLike input", async () => {
  expect.assertions(2);
  try {
    await uniqWith(null).next();
  } catch (error) {
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toMatchInlineSnapshot(
      `"Must provide an iterable, async iterable, Array-like value, or a Promise."`
    );
  }
});

test("returns same async iterator", () => {
  expect.assertions(1);
  expect(uniqWith(of(), isStringEqual)).toReturnSameAsyncIterator();
});

test("returns a closeable iterator", async () => {
  expect.assertions(1);
  await expect(uniqWith(of(), isStringEqual)).toBeCloseableAsyncIterator();
});

test("lazily consumes provided IterableLike input", async () => {
  expect.assertions(1);
  await expect(_ =>
    uniqWith(_, isStringEqual)
  ).toLazilyConsumeWrappedAsyncIterable();
});

test("calls callback with 2 arguments", async () => {
  expect.assertions(1);

  await drain(
    uniqWith(of("foo", "bar"), (...args) => {
      expect(args).toHaveLength(2);
    })
  );
});

test("provides current value as first argument to callback", async () => {
  expect.assertions(3);

  let input = of("foo", "bar", "baz");
  let expectedValues = [
    // First value is always emitted (foo)

    // Second iteration (bar)
    "bar",

    // Third iteration (baz)
    "baz",
    "baz"
  ];

  await drain(
    uniqWith(input, value => {
      expect(value).toStrictEqual(expectedValues.shift());
    })
  );
});

test("provides seen values as second argument to callback", async () => {
  expect.assertions(3);

  let input = of("foo", "bar", "baz");
  let expectedValues = [
    // Second iteration (bar)
    "foo",

    // Third iteration (baz)
    "foo",
    "bar"
  ];

  await drain(
    uniqWith(input, (_value, seenValue) => {
      expect(seenValue).toStrictEqual(expectedValues.shift());
    })
  );
});

test("calls callback with an `undefined` `this`-context by default", async () => {
  expect.assertions(1);
  await drain(uniqWith(of("foo", "bar"), testCallback));

  function testCallback() {
    expect(this).toBeUndefined();
  }
});

test("calls callback with the `this`-context provided by `thisArg` argument", async () => {
  expect.assertions(1);
  let expectedThis = {};
  await drain(uniqWith(of("foo", "bar"), testCallback, expectedThis));

  function testCallback() {
    expect(this).toBe(expectedThis);
  }
});

describe.each`
  callbackType | callback
  ${"async"}   | ${isStringEqual}
  ${"sync"}    | ${isStringEqualSync}
`("$callbackType callback", async ({ callback }) => {
  test.each`
    inputType          | iterableLike                               | expectedValues
    ${"AsyncIterable"} | ${of(true, "true", NaN, "NaN")}            | ${[true, NaN]}
    ${"Iterable"}      | ${[true, "true", NaN, "NaN"]}              | ${[true, NaN]}
    ${"ArrayLike"}     | ${new ArrayLike(true, "true", NaN, "NaN")} | ${[true, NaN]}
    ${"Promise"}       | ${Promise.resolve(true)}                   | ${[true]}
  `(
    "only yields unique values according to callback",
    async ({ iterableLike, expectedValues }) => {
      expect.assertions(expectedValues.length);
      for await (let value of uniqWith(iterableLike, callback)) {
        expect(value).toStrictEqual(expectedValues.shift());
      }
    }
  );
});
