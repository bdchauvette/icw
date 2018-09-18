import { tap } from "../src/tap";

import { drain } from "../src/drain";
import { forEach } from "../src/forEach";
import { of } from "../src/of";
import { noop } from "./helpers/noop";
import { noopSync } from "./helpers/noopSync";
import { ArrayLike } from "./helpers/ArrayLike";

test("rejects on non-IterableLike input", async () => {
  expect.assertions(2);
  try {
    await tap(null, noop).next();
  } catch (error) {
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toMatchInlineSnapshot(
      `"Must provide an iterable, async iterable, Array-like value, or a Promise."`
    );
  }
});

test("returns same async iterator", () => {
  expect.assertions(1);
  expect(tap(of(), noop)).toReturnSameAsyncIterator();
});

test("returns a closeable iterator", async () => {
  expect.assertions(1);
  await expect(tap(of(), noop)).toBeCloseableAsyncIterator();
});

test("lazily consumes provided IterableLike input", async () => {
  expect.assertions(1);
  await expect(_ => tap(_, noop)).toLazilyConsumeWrappedAsyncIterable();
});

test("calls callback with 2 arguments", async () => {
  expect.assertions(1);

  await drain(
    tap(of(true), (...args) => {
      expect(args).toHaveLength(2);
    })
  );
});

test("provides current value as first argument to callback", async () => {
  expect.assertions(3);

  let input = of("foo", "bar", "baz");
  let expectedArgs = ["foo", "bar", "baz"];

  await drain(
    tap(input, value => {
      expect(value).toStrictEqual(expectedArgs.shift());
    })
  );
});

test("provides current index as second argument to callback", async () => {
  expect.assertions(3);

  let input = of("foo", "bar", "baz");
  let expectedIndexes = [0, 1, 2];

  await drain(
    tap(input, (_, index) => {
      expect(index).toStrictEqual(expectedIndexes.shift());
    })
  );
});

test("calls callback with an `undefined` `this`-context by default", async () => {
  expect.assertions(1);
  await drain(tap(of(1), testCallback));

  function testCallback() {
    expect(this).toBeUndefined();
  }
});

test("calls callback with the `this`-context provided by `thisArg` argument", async () => {
  expect.assertions(1);
  let expectedThis = {};
  await drain(tap(of(1), testCallback, expectedThis));

  function testCallback() {
    expect(this).toBe(expectedThis);
  }
});

test("calls callback before yielding the value", async () => {
  expect.assertions(3);
  let callback = jest.fn();
  let tap$ = tap(of("foo", "bar", "baz"), callback);

  await forEach(tap$, (_, index) => {
    // If the value were yielded _before_ calling the callback, then the
    // call count would be equal to the index, because the generator would
    // suspend before calling the function.
    expect(callback).toHaveBeenCalledTimes(index + 1);
  });
});

describe.each`
  callbackType | callback
  ${"async"}   | ${noop}
  ${"sync"}    | ${noopSync}
`("$callbackType callback", ({ callback }) => {
  test.each`
    inputType          | iterableLike                          | expectedCallCount
    ${"AsyncIterable"} | ${of("foo", "bar", "baz")}            | ${3}
    ${"Iterable"}      | ${["foo", "bar", "baz"]}              | ${3}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")} | ${3}
    ${"Promise"}       | ${Promise.resolve("foo")}             | ${1}
  `(
    "calls callback once for each value of $inputType input",
    async ({ iterableLike, expectedCallCount }) => {
      expect.assertions(1);
      let mockCallback = jest.fn(callback);
      await drain(tap(iterableLike, mockCallback));
      expect(mockCallback).toHaveBeenCalledTimes(expectedCallCount);
    }
  );

  test.each`
    inputType          | iterableLike                          | expectedValues
    ${"AsyncIterable"} | ${of("foo", "bar", "baz")}            | ${["foo", "bar", "baz"]}
    ${"Iterable"}      | ${["foo", "bar", "baz"]}              | ${["foo", "bar", "baz"]}
    ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")} | ${["foo", "bar", "baz"]}
    ${"Promise"}       | ${Promise.resolve("foo")}             | ${["foo"]}
  `(
    "yields each value from $inputType input",
    async ({ iterableLike, expectedValues }) => {
      expect.assertions(expectedValues.length);
      for await (let value of tap(iterableLike, callback)) {
        expect(value).toStrictEqual(expectedValues.shift());
      }
    }
  );
});
