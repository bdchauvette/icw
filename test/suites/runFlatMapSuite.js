import { drain } from "../../src/drain";
import { of } from "../../src/of";
import { ArrayLike } from "../helpers/ArrayLike";
import { toUpperCase } from "../helpers/toUpperCase";
import { toUpperCaseSync } from "../helpers/toUpperCaseSync";

export function runFlatMapSuite(flatMap) {
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
    ${"async"}   | ${toUpperCase}
    ${"sync"}    | ${toUpperCaseSync}
  `("$callbackType callback", async ({ callback }) => {
    test.each`
      inputType          | iterableLike                          | expectedValues
      ${"AsyncIterable"} | ${of("foo", "bar", "baz")}            | ${["F", "O", "O", "B", "A", "R", "B", "A", "Z"]}
      ${"Iterable"}      | ${["foo", "bar", "baz"]}              | ${["F", "O", "O", "B", "A", "R", "B", "A", "Z"]}
      ${"ArrayLike"}     | ${new ArrayLike("foo", "bar", "baz")} | ${["F", "O", "O", "B", "A", "R", "B", "A", "Z"]}
      ${"Promise"}       | ${Promise.resolve("foo")}             | ${["F", "O", "O"]}
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
}
