import { of } from "../../src/of";
import { ArrayLike } from "../helpers/ArrayLike";
import { isTruthy } from "../helpers/isTruthy";
import { isTruthySync } from "../helpers/isTruthySync";

export function runFindLastSuite(findLast) {
  test("eagerly consumes wrapped IterableLike input", async () => {
    expect.assertions(1);
    await expect(_ =>
      findLast(_, isTruthy)
    ).toEagerlyConsumeWrappedAsyncIterable();
  });

  test("calls callback with 2 arguments", async () => {
    expect.assertions(1);
    await findLast(of("foo"), (...args) => {
      expect(args).toHaveLength(2);
    });
  });

  test("provides current value as first argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedValues = ["foo", "bar", "baz"];

    await findLast(input, value => {
      expect(value).toStrictEqual(expectedValues.shift());
    });
  });

  test("provides current index as second argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedIndexes = [0, 1, 2];

    await findLast(input, (_, index) => {
      expect(index).toStrictEqual(expectedIndexes.shift());
    });
  });

  test("calls callback with an `undefined` `this`-context by default", async () => {
    expect.assertions(1);
    await findLast(of("foo"), testCallback);

    function testCallback() {
      expect(this).toBeUndefined();
    }
  });

  test("calls callback with the `this`-context provided by `thisArg` argument", async () => {
    expect.assertions(1);
    let expectedThis = {};
    await findLast(of("foo"), testCallback, expectedThis);

    function testCallback() {
      expect(this).toBe(expectedThis);
    }
  });

  describe.each`
    callbackType | callback
    ${"async"}   | ${isTruthy}
    ${"sync"}    | ${isTruthySync}
  `("$callbackType callback", async ({ callback }) => {
    test.each`
      inputType          | iterableLike                                | expectedValue
      ${"AsyncIterable"} | ${of(false, false, true, "foo")}            | ${"foo"}
      ${"Iterable"}      | ${[false, false, true, "foo"]}              | ${"foo"}
      ${"ArrayLike"}     | ${new ArrayLike(false, false, true, "foo")} | ${"foo"}
      ${"Promise"}       | ${Promise.resolve(true)}                    | ${true}
    `(
      "returns Promise containing the last value from $inputType input that satisfies the predicate",
      async ({ iterableLike, expectedValue }) => {
        expect.assertions(1);
        await expect(findLast(iterableLike, callback)).resolves.toStrictEqual(
          expectedValue
        );
      }
    );

    test.each`
      inputType          | iterableLike                          | expectedValue
      ${"AsyncIterable"} | ${of(false, false, false)}            | ${undefined}
      ${"Iterable"}      | ${[false, false, false]}              | ${undefined}
      ${"ArrayLike"}     | ${new ArrayLike(false, false, false)} | ${undefined}
      ${"Promise"}       | ${Promise.resolve(false)}             | ${undefined}
    `(
      "returns Promise<undefined> if no value in $inputType input satisfies the predicate",
      async ({ iterableLike, expectedValue }) => {
        expect.assertions(1);
        await expect(findLast(iterableLike, callback)).resolves.toStrictEqual(
          expectedValue
        );
      }
    );
  });
}
