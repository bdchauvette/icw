import { flat } from "../src/flat";

import { of } from "../src/of";
import { ArrayLike } from "./helpers/ArrayLike";

test("returns same async iterator", () => {
  expect.assertions(1);
  expect(flat(of())).toReturnSameAsyncIterator();
});

test("returns a closeable iterator", async () => {
  expect.assertions(1);
  await expect(flat(of())).toBeCloseableAsyncIterator();
});

test("lazily consumes provided IterableLike input", async () => {
  expect.assertions(1);
  await expect(_ => flat(_)).toLazilyConsumeWrappedAsyncIterable();
});

test.each`
  inputType          | iterableLike                                   | expectedValues
  ${"AsyncIterable"} | ${of(of(1, 2), of(3, 4), of(5, 6))}            | ${[1, 2, 3, 4, 5, 6]}
  ${"Iterable"}      | ${[of(1, 2), of(3, 4), of(5, 6)]}              | ${[1, 2, 3, 4, 5, 6]}
  ${"ArrayLike"}     | ${new ArrayLike(of(1, 2), of(3, 4), of(5, 6))} | ${[1, 2, 3, 4, 5, 6]}
  ${"Promise"}       | ${Promise.resolve(of(1, 2, 3, 4, 5, 6))}       | ${[1, 2, 3, 4, 5, 6]}
`(
  "flattens $inputType input one level deep by default",
  async ({ iterableLike, expectedValues }) => {
    expect.assertions(expectedValues.length);
    for await (let value of flat(iterableLike)) {
      expect(value).toStrictEqual(expectedValues.shift());
    }
  }
);

test.each`
  inputType          | iterableLike                                       | depth | expectedValues
  ${"AsyncIterable"} | ${of(of(1, [2, [3, [4, [5, [6]]]]]))}              | ${2}  | ${[1, 2, [3, [4, [5, [6]]]]]}
  ${"Iterable"}      | ${[of(1, [2, [3, [4, [5, [6]]]]])]}                | ${2}  | ${[1, 2, [3, [4, [5, [6]]]]]}
  ${"ArrayLike"}     | ${new ArrayLike(of(1, [2, [3, [4, [5, [6]]]]]))}   | ${2}  | ${[1, 2, [3, [4, [5, [6]]]]]}
  ${"Promise"}       | ${Promise.resolve(of(1, [2, [3, [4, [5, [6]]]]]))} | ${2}  | ${[1, 2, [3, [4, [5, [6]]]]]}
`(
  "flattens $inputType input only to the `depth` provided",
  async ({ iterableLike, depth, expectedValues }) => {
    expect.assertions(expectedValues.length);
    for await (let value of flat(iterableLike, depth)) {
      expect(value).toStrictEqual(expectedValues.shift());
    }
  }
);

test.each`
  inputType          | iterableLike                           | depth | expectedValues
  ${"AsyncIterable"} | ${of(of(1, 2), 3, 4)}                  | ${1}  | ${[1, 2, 3, 4]}
  ${"Iterable"}      | ${[of(1, 2), 3, 4]}                    | ${1}  | ${[1, 2, 3, 4]}
  ${"ArrayLike"}     | ${new ArrayLike(of(1, 2), 3, 4)}       | ${1}  | ${[1, 2, 3, 4]}
  ${"Promise"}       | ${Promise.resolve(of(of(1, 2), 3, 4))} | ${2}  | ${[1, 2, 3, 4]}
`(
  "works when $inputType input includes non-iterableLike values",
  async ({ iterableLike, depth, expectedValues }) => {
    expect.assertions(expectedValues.length);
    for await (let value of flat(iterableLike, depth)) {
      expect(value).toStrictEqual(expectedValues.shift());
    }
  }
);

test.each`
  inputType          | iterableLike              | expectedValues
  ${"AsyncIterable"} | ${of("foo")}              | ${["foo"]}
  ${"Iterable"}      | ${["foo"]}                | ${["foo"]}
  ${"ArrayLike"}     | ${new ArrayLike("foo")}   | ${["foo"]}
  ${"Promise"}       | ${Promise.resolve("foo")} | ${["foo"]}
`(
  "does not flatten string values from $inputType input",
  async ({ iterableLike, depth, expectedValues }) => {
    expect.assertions(expectedValues.length);
    for await (let value of flat(iterableLike, depth)) {
      expect(value).toStrictEqual(expectedValues.shift());
    }
  }
);
