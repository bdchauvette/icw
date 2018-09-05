import { drain } from "../../src/drain";
import { of } from "../../src/of";
import { isTruthy } from "../helpers/isTruthy";
import { isTruthySync } from "../helpers/isTruthySync";
import { ArrayLike } from "../helpers/ArrayLike";

export function runTakeWhileSuite(takeWhile) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(takeWhile(of(), isTruthy)).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(takeWhile(of(), isTruthy)).toBeCloseableAsyncIterator();
  });

  test("lazily consumes provided IterableLike input", async () => {
    expect.assertions(1);
    await expect(_ =>
      takeWhile(_, isTruthy)
    ).toLazilyConsumeWrappedAsyncIterable();
  });

  test("calls callback with 2 arguments", async () => {
    expect.assertions(1);

    await drain(
      takeWhile(of(true), (...args) => {
        expect(args).toHaveLength(2);
      })
    );
  });

  test("provides current value as first argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedValues = ["foo", "bar", "baz"];

    await drain(
      takeWhile(input, value => {
        expect(value).toStrictEqual(expectedValues.shift());
        return true;
      })
    );
  });

  test("provides current index as second argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedIndexes = [0, 1, 2];

    await drain(
      takeWhile(input, (_, index) => {
        expect(index).toStrictEqual(expectedIndexes.shift());
        return true;
      })
    );
  });

  test("calls callback with an `undefined` `this`-context by default", async () => {
    expect.assertions(1);
    await drain(takeWhile(of(1), testCallback));

    function testCallback() {
      expect(this).toBeUndefined();
    }
  });

  test("calls callback with the `this`-context provided by `thisArg` argument", async () => {
    expect.assertions(1);
    let expectedThis = {};
    await drain(takeWhile(of(1), testCallback, expectedThis));

    function testCallback() {
      expect(this).toBe(expectedThis);
    }
  });

  describe.each`
    callbackType | callback
    ${"async"}   | ${isTruthy}
    ${"sync"}    | ${isTruthySync}
  `("$callbackType callback", ({ callback }) => {
    test.each`
      inputType          | iterableLike                                     | expectedValues
      ${"AsyncIterable"} | ${of(true, true, false, false, true)}            | ${[true, true]}
      ${"Iterable"}      | ${[true, true, false, false, true]}              | ${[true, true]}
      ${"ArrayLike"}     | ${new ArrayLike(true, true, false, false, true)} | ${[true, true]}
    `(
      "takes values from $inputType input until the predicate is falsy for the first time",
      async ({ iterableLike, expectedValues }) => {
        expect.assertions(expectedValues.length);
        for await (let value of takeWhile(iterableLike, callback)) {
          expect(value).toStrictEqual(expectedValues.shift());
        }
      }
    );

    test("yields resolved Promise value if it *does* satisfy the predicate", async () => {
      expect.assertions(1);
      for await (let value of takeWhile(Promise.resolve(true), callback)) {
        expect(value).toStrictEqual(true);
      }
    });

    test("yields no values if resolved Promise value does *not* satisfy the predicate", async () => {
      expect.assertions(1);
      let iterator = takeWhile(Promise.resolve(false), callback);
      let result = await iterator.next();
      expect(result.done).toBe(true);
    });
  });
}
