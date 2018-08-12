import { noop } from "../helpers/noop";

export function runForEachSuite(forEach) {
  test("returns a Promise", async () => {
    expect.assertions(1);
    expect(forEach([], noop)).toBeInstanceOf(Promise);
  });

  test.each`
    iterableType | iteratorSymbol          | iterator
    ${"sync"}    | ${Symbol.iterator}      | ${function*() {}}
    ${"async"}   | ${Symbol.asyncIterator} | ${async function*() {}}
  `(
    "eagerly consumes the provided $iterableType iterable",
    async ({ iteratorSymbol, iterator }) => {
      expect.assertions(1);
      let iterable = { [iteratorSymbol]: jest.fn(iterator) };

      await forEach(iterable, noop);
      expect(iterable[iteratorSymbol]).toHaveBeenCalled();
    }
  );

  test("runs the provided iterable to completion", async () => {
    expect.assertions(1);

    let iteratorDidFinish = false;

    await forEach(
      (function*() {
        yield* [1, 2, 3];
        iteratorDidFinish = true;
      })(),
      noop
    );

    expect(iteratorDidFinish).toBeTruthy();
  });

  test("runs the provided async iterable to completion", async () => {
    expect.assertions(1);

    let iteratorDidFinish = false;

    await forEach(
      (async function*() {
        yield* [1, 2, 3];
        iteratorDidFinish = true;
      })(),
      noop
    );

    expect(iteratorDidFinish).toBeTruthy();
  });

  test("provides current result as first argument to callback", async () => {
    expect.assertions(3);

    let input = ["foo", "bar", "baz"];
    let expectedArgs = ["foo", "bar", "baz"];

    await forEach(input, result => {
      expect(result).toEqual(expectedArgs.shift());
    });
  });

  test("provides current index as second argument to callback", async () => {
    expect.assertions(3);

    let expectedIndexes = [0, 1, 2];

    await forEach(["foo", "bar", "baz"], (_, index) => {
      expect(index).toEqual(expectedIndexes.shift());
    });
  });

  test("calls callback with an `undefined` `this`-context by default", async () => {
    expect.assertions(1);
    await forEach([1], function() {
      expect(this).toBeUndefined();
    });
  });

  test("calls callback with the `this`-context provided `thisArg` argument", async () => {
    expect.assertions(1);
    let expectedThis = {};
    await forEach(
      [1],
      function() {
        expect(this).toBe(expectedThis);
      },
      expectedThis
    );
  });
}
