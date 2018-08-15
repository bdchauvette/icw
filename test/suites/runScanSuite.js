import { toAsync } from "../helpers/toAsync";
import { sum } from "../helpers/sum";
import { drain } from "../../src/drain";

export function runScanSuite(scan) {
  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(scan([], sum)).toReturnSameAsyncIterator();
  });

  test.each`
    iterableType | createIterableIterator
    ${"sync"}    | ${function*() {}}
    ${"async"}   | ${async function*() {}}
  `(
    "lazily consumes the provided $iterableType iterable",
    async ({ createIterableIterator }) => {
      expect.assertions(2);

      let iterableIterator = createIterableIterator();
      let next = jest.spyOn(iterableIterator, "next");

      let sum$ = scan(iterableIterator, sum)[Symbol.asyncIterator]();
      expect(next).not.toHaveBeenCalled();

      await sum$.next();
      expect(next).toHaveBeenCalled();
    }
  );

  test.each`
    callbackType | callback
    ${"sync"}    | ${sum}
    ${"async"}   | ${toAsync(sum)}
  `(
    "accumulates values from the source iterable with $callbackType callback",
    async () => {
      expect.assertions(3);

      let input = [1, 2, 3];
      let expectedResults = [2, 4, 7];

      for await (let result of scan(input, sum)) {
        expect(result).toEqual(expectedResults.shift());
      }
    }
  );

  test("uses provided initial value as first accumulator value", async () => {
    expect.assertions(1);
    let sumSpy = jest.fn();
    let firstResult = Symbol("first result");
    let initialValue = Symbol("initial value");
    await drain(scan([firstResult], sumSpy, initialValue));
    expect(sumSpy.mock.calls[0][0]).toBe(initialValue);
  });

  test("uses first result as initial accumulator accumulator value if no initial value is provided", async () => {
    expect.assertions(1);
    let sumSpy = jest.fn();
    let firstResult = Symbol("first result");
    await drain(scan([firstResult], sumSpy));
    expect(sumSpy.mock.calls[0][0]).toBe(firstResult);
  });

  test("uses `undefined` as initial accumulator value if it is explicitly provided", async () => {
    expect.assertions(1);
    let sumSpy = jest.fn();
    let firstResult = Symbol("first result");
    await drain(scan([firstResult], sumSpy, undefined));
    expect(sumSpy.mock.calls[0][0]).toBeUndefined();
  });

  test("provides accumulator as first argument to callback", async () => {
    expect.assertions(3);

    let mockCallback = jest.fn(sum);
    await drain(scan([1, 2, 3], mockCallback));

    expect(mockCallback.mock.calls[0][0]).toEqual(1);
    expect(mockCallback.mock.calls[1][0]).toEqual(2);
    expect(mockCallback.mock.calls[2][0]).toEqual(4);
  });

  test("provides current result as second argument to callback", async () => {
    expect.assertions(3);

    let mockCallback = jest.fn(sum);
    await drain(scan([1, 2, 3], mockCallback));

    expect(mockCallback.mock.calls[0][1]).toEqual(1);
    expect(mockCallback.mock.calls[1][1]).toEqual(2);
    expect(mockCallback.mock.calls[2][1]).toEqual(3);
  });

  test("provides current index as third argument to callback", async () => {
    expect.assertions(3);

    let mockCallback = jest.fn(sum);
    await drain(scan([1, 2, 3], mockCallback));

    expect(mockCallback.mock.calls[0][2]).toEqual(0);
    expect(mockCallback.mock.calls[1][2]).toEqual(1);
    expect(mockCallback.mock.calls[2][2]).toEqual(2);
  });
}
