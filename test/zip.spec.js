import { zip } from "../src/zip";

import { of } from "../src/of";
import { drain } from "../src";
import { ArrayLike } from "./helpers/ArrayLike";

test("rejects on non-IterableLike input", async () => {
  expect.assertions(2);
  try {
    await zip(null).next();
  } catch (error) {
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toMatchInlineSnapshot(
      `"Must provide an iterable, async iterable, Array-like value, or a Promise."`
    );
  }
});

test("returns same async iterator", () => {
  expect.assertions(1);
  expect(zip(of())).toReturnSameAsyncIterator();
});

test("returns a closeable iterator", async () => {
  expect.assertions(1);
  await expect(zip(of())).toBeCloseableAsyncIterator();
});

test("lazily consumes provided IterableLike input", async () => {
  expect.assertions(1);
  await expect(_ => zip(_)).toLazilyConsumeWrappedAsyncIterable();
});

test("zips AsyncIterable input", async () => {
  expect.assertions(3);

  let zip$ = zip(of("foo", "bar", "baz"), of(1, 2, 3), of("a", "b", "c"));
  let expectedValues = [["foo", 1, "a"], ["bar", 2, "b"], ["baz", 3, "c"]];

  for await (let tuple of zip$) {
    expect(tuple).toStrictEqual(expectedValues.shift());
  }
});

test("zips Iterable input", async () => {
  expect.assertions(3);

  let zip$ = zip(["foo", "bar", "baz"], [1, 2, 3], ["a", "b", "c"]);
  let expectedValues = [["foo", 1, "a"], ["bar", 2, "b"], ["baz", 3, "c"]];

  for await (let tuple of zip$) {
    expect(tuple).toStrictEqual(expectedValues.shift());
  }
});

test("zips ArrayLike input", async () => {
  expect.assertions(3);
  let zip$ = zip(
    new ArrayLike("foo", "bar", "baz"),
    new ArrayLike(1, 2, 3),
    new ArrayLike("a", "b", "c")
  );
  let expectedValues = [["foo", 1, "a"], ["bar", 2, "b"], ["baz", 3, "c"]];

  for await (let tuple of zip$) {
    expect(tuple).toStrictEqual(expectedValues.shift());
  }
});

test("zips Promise input", async () => {
  expect.assertions(1);

  let zip$ = zip(
    Promise.resolve("foo"),
    Promise.resolve("bar"),
    Promise.resolve("baz")
  );
  let expectedValues = [["foo", "bar", "baz"]];

  for await (let tuple of zip$) {
    expect(tuple).toStrictEqual(expectedValues.shift());
  }
});

test("ends zipping after the first iterableLike input has completed", async () => {
  expect.assertions(2);

  let zip$ = zip(of("a", "b"), of("foo", "bar", "baz"));
  let expectedValues = [["a", "foo"], ["b", "bar"]];

  for await (let tuple of zip$) {
    expect(tuple).toStrictEqual(expectedValues.shift());
  }
});

test("closes all iterators after any iterator has closed", async () => {
  expect.assertions(3);

  let iterables = [of("a"), of("foo", "bar", "baz"), of(1, 2, 3)];
  let iterators = iterables.map(iterable => iterable[Symbol.asyncIterator]());

  let zip$ = zip(...iterables);
  await drain(zip$);

  for await (let iterator of iterators) {
    await expect(iterator.next()).resolves.toStrictEqual({
      value: undefined,
      done: true
    });
  }
});

test("closes all iterators when zip$ closes", async () => {
  expect.assertions(3);

  let iterables = [of("foo", "bar", "baz"), of(1, 2, 3), of("a", "b", "c")];
  let iterators = iterables.map(iterable => iterable[Symbol.asyncIterator]());

  let zip$ = zip(...iterables);

  await zip$.return();

  for await (let iterator of iterators) {
    await expect(iterator.next()).resolves.toStrictEqual({
      value: undefined,
      done: true
    });
  }
});

test("closes all iterators when zip$ throws", async () => {
  expect.assertions(3);

  let iterables = [of("foo", "bar", "baz"), of(1, 2, 3), of("a", "b", "c")];
  let iterators = iterables.map(iterable => iterable[Symbol.asyncIterator]());

  let zip$ = zip(...iterables);
  let error = new Error("boom");

  try {
    zip$.throw(error);
  } finally {
    for await (let iterator of iterators) {
      await expect(iterator.next()).resolves.toStrictEqual({
        value: undefined,
        done: true
      });
    }
  }
});

test("rethrows errors", async () => {
  expect.assertions(1);

  let zip$ = zip();
  let error = new Error("boom");

  try {
    await zip$.throw(error);
  } catch (thrownError) {
    expect(thrownError).toBe(error);
  }
});
