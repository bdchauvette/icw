import { drain, of } from "../../src";
import { sum } from "../helpers/sum";
import { sumSync } from "../helpers/sumSync";
import { ArrayLike } from "../helpers/ArrayLike";

export function runScanSuite(scan) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(scan(of(), sum)).toReturnSameAsyncIterator();
  });

  test("returns a closeable iterator", async () => {
    expect.assertions(1);
    await expect(scan(of(), sum)).toBeCloseableAsyncIterator();
  });

  test("lazily consumes provided IterableLike input", async () => {
    expect.assertions(1);
    await expect(_ => scan(_, sum)).toLazilyConsumeWrappedAsyncIterable();
  });

  test("calls callback with 3 arguments", async () => {
    expect.assertions(1);

    await drain(
      scan(of(true), (...args) => {
        expect(args).toHaveLength(3);
      })
    );
  });

  test("provides accumulator as first argument to callback", async () => {
    expect.assertions(3);

    let input = of(1, 2, 3);
    let expectedAccumulators = [0, 1, 3];
    let testCallback = jest.fn(sum);

    await drain(scan(input, testCallback, 0));

    testCallback.mock.calls.forEach((mockCall, index) => {
      expect(mockCall[0]).toStrictEqual(expectedAccumulators[index]);
    });
  });

  test("uses provided seed as first accumulator", async () => {
    expect.assertions(1);

    let seed = "seed";
    let input = of("foo");

    await drain(scan(input, testCallback, seed));

    function testCallback(accumulator) {
      expect(accumulator).toStrictEqual(seed);
    }
  });

  test("uses `undefined` as first accumulator if seed is explicitly set to `undefined`", async () => {
    expect.assertions(1);

    let input = of("foo");

    await drain(scan(input, testCallback, undefined));

    function testCallback(accumulator) {
      expect(accumulator).toBeUndefined();
    }
  });

  test("uses first value as first accumulator if seed is not provided", async () => {
    expect.assertions(1);

    let input = of("foo");

    await drain(scan(input, testCallback));

    function testCallback(accumulator) {
      expect(accumulator).toStrictEqual("foo");
    }
  });

  test("provides current value as second argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedValues = ["foo", "bar", "baz"];

    await drain(
      scan(input, (_, value) => {
        expect(value).toStrictEqual(expectedValues.shift());
      })
    );
  });

  test("provides current index as third argument to callback", async () => {
    expect.assertions(3);

    let input = of("foo", "bar", "baz");
    let expectedIndexes = [0, 1, 2];

    await drain(
      scan(input, (_, __, value) => {
        expect(value).toStrictEqual(expectedIndexes.shift());
      })
    );
  });

  describe.each`
    callbackType | callback
    ${"async"}   | ${sum}
    ${"sync"}    | ${sumSync}
  `("$callbackType callback", ({ callback }) => {
    test.each`
      inputType          | iterableLike              | expectedValues
      ${"AsyncIterable"} | ${of(1, 3, 5)}            | ${[1, 4, 9]}
      ${"Iterable"}      | ${[1, 3, 5]}              | ${[1, 4, 9]}
      ${"ArrayLike"}     | ${new ArrayLike(1, 3, 5)} | ${[1, 4, 9]}
      ${"Promise"}       | ${Promise.resolve(1)}     | ${[1]}
    `(
      "yields accumulated value for each item of $inputType input",
      async ({ iterableLike, expectedValues }) => {
        expect.assertions(expectedValues.length);
        for await (let value of scan(iterableLike, callback, 0)) {
          expect(value).toStrictEqual(expectedValues.shift());
        }
      }
    );
  });
}
