import { uniq } from "../src/uniq";

import { of } from "../src/of";
import { ArrayLike } from "./helpers/ArrayLike";

test("rejects on non-IterableLike input", async () => {
  expect.assertions(2);
  try {
    await uniq(null).next();
  } catch (error) {
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toMatchInlineSnapshot(
      `"Must provide an iterable, async iterable, Array-like value, or a Promise."`
    );
  }
});

test("returns same async iterator", () => {
  expect.assertions(1);
  expect(uniq(of())).toReturnSameAsyncIterator();
});

test("returns a closeable iterator", async () => {
  expect.assertions(1);
  await expect(uniq(of())).toBeCloseableAsyncIterator();
});

test("lazily consumes provided IterableLike input", async () => {
  expect.assertions(1);
  await expect(_ => uniq(_)).toLazilyConsumeWrappedAsyncIterable();
});

test.each`
  inputType          | iterableLike                                 | expectedValues
  ${"AsyncIterable"} | ${of("foo", "foo", "bar", "baz")}            | ${["foo", "bar", "baz"]}
  ${"Iterable"}      | ${["foo", "foo", "bar", "baz"]}              | ${["foo", "bar", "baz"]}
  ${"ArrayLike"}     | ${new ArrayLike("foo", "foo", "bar", "baz")} | ${["foo", "bar", "baz"]}
  ${"Promise"}       | ${Promise.resolve("foo")}                    | ${["foo"]}
`("only yields unique values", async ({ iterableLike, expectedValues }) => {
  expect.assertions(expectedValues.length);
  for await (let value of uniq(iterableLike)) {
    expect(value).toStrictEqual(expectedValues.shift());
  }
});

test.each`
  iterableLike                              | expectedValues
  ${[true, true]}                           | ${[true]}
  ${[false, false]}                         | ${[false]}
  ${[undefined, undefined]}                 | ${[undefined]}
  ${[null, null]}                           | ${[null]}
  ${[0, 0]}                                 | ${[0]}
  ${[-0, -0]}                               | ${[-0]}
  ${["foo", "foo"]}                         | ${["foo"]}
  ${["", ""]}                               | ${[""]}
  ${["0", "0"]}                             | ${["0"]}
  ${["123", "123"]}                         | ${["123"]}
  ${[[1, 2, 3], [1, 2, 3]]}                 | ${[[1, 2, 3], [1, 2, 3]]}
  ${[[], []]}                               | ${[[], []]}
  ${[new String("foo"), new String("foo")]} | ${[new String("foo"), new String("foo")]}
  ${[NaN, NaN]}                             | ${[NaN]}
`(
  "uses SameValueZero comparison ($iterableLike -> $expectedValues)",
  async ({ iterableLike, expectedValues }) => {
    expect.assertions(expectedValues.length);
    for await (let value of uniq(iterableLike)) {
      expect(value).toStrictEqual(expectedValues.shift());
    }
  }
);
