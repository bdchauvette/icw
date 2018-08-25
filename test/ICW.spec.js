import { ICW } from "../src";

import { runFromSuite } from "./suites/runFromSuite";
import { runOfSuite } from "./suites/runOfSuite";

import { runCollectSuite } from "./suites/runCollectSuite";
import { runDrainSuite } from "./suites/runDrainSuite";
import { runFilterSuite } from "./suites/runFilterSuite";
import { runFirstSuite } from "./suites/runFirstSuite";
import { runForEachSuite } from "./suites/runForEachSuite";
import { runHeadSuite } from "./suites/runHeadSuite";
import { runMapSuite } from "./suites/runMapSuite";
import { runRejectSuite } from "./suites/runRejectSuite";
import { runScanSuite } from "./suites/runScanSuite";
import { runSkipSuite } from "./suites/runSkipSuite";
import { runSkipWhileSuite } from "./suites/runSkipWhileSuite";
import { runTailSuite } from "./suites/runTailSuite";
import { runTakeSuite } from "./suites/runTakeSuite";
import { runTakeWhileSuite } from "./suites/runTakeWhileSuite";
import { runTapSuite } from "./suites/runTapSuite";
import { runToArraySuite } from "./suites/runToArraySuite";
import { runToPromiseSuite } from "./suites/runToPromiseSuite";
import { runWithIndexSuite } from "./suites/runWithIndexSuite";

describe.each`
  method    | runSuite
  ${"of"}   | ${runOfSuite}
  ${"from"} | ${runFromSuite}
`("static method $method", ({ method, runSuite }) => {
  runSuite(ICW[method]);
});

describe("constructor", () => {
  test.each`
    iterableType | iterable
    ${"sync"}    | ${[]}
    ${"async"}   | ${(async function*() {})()}
  `(
    "does not throw error when $iterableType iterable is provided",
    ({ iterable }) => {
      expect.assertions(1);
      expect(() => new ICW(iterable)).not.toThrowError();
    }
  );

  test("throws an error if no iterable is provided", () => {
    expect.assertions(1);
    expect(() => new ICW(null)).toThrowErrorMatchingInlineSnapshot(
      `"First argument must implement the Iterable protocol"`
    );
  });
});

describe("prototype method [Symbol.asyncIterator]", () => {
  test("returns itself", () => {
    expect.assertions(1);
    let icw = new ICW([]);
    expect(icw[Symbol.asyncIterator]()).toBe(icw);
  });

  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(new ICW([])).toReturnSameAsyncIterator();
  });
});

describe('prototype method "next"', () => {
  test.each`
    iteratorType | createIterableIterator
    ${"sync"}    | ${function*() {}}
    ${"async"}   | ${async function*() {}}
  `(
    "calls method on wrapped $iteratorType iterator",
    async ({ createIterableIterator }) => {
      expect.assertions(1);

      let iterableIterator = createIterableIterator();
      let wrappedNext = jest.spyOn(iterableIterator, "next");

      let icw = new ICW(iterableIterator);
      await icw.next("foo");
      expect(wrappedNext).toHaveBeenCalledWith("foo");
    }
  );
});

describe('prototype method "return"', () => {
  test.each`
    iteratorType | createIterableIterator
    ${"sync"}    | ${function*() {}}
    ${"async"}   | ${async function*() {}}
  `(
    "calls method on wrapped $iteratorType iterator, if it exists",
    async ({ createIterableIterator }) => {
      expect.assertions(1);

      let iterableIterator = createIterableIterator();
      let wrappedReturn = jest.spyOn(iterableIterator, "return");

      let icw = new ICW(iterableIterator);
      await icw.return("foo");
      expect(wrappedReturn).toHaveBeenCalledWith("foo");
    }
  );

  test.each`
    iteratorType | iteratorSymbol
    ${"sync"}    | ${Symbol.iterator}
    ${"async"}   | ${Symbol.asyncIterator}
  `(
    "returns { done: true, value: undefined } if wrapped $iteratorType iterable does not have method",
    async ({ iteratorSymbol }) => {
      expect.assertions(1);

      let iterable = {
        [iteratorSymbol]: () => ({
          next: () => ({ done: true })
        })
      };

      let icw = new ICW(iterable);
      let result = await icw.return("foo");
      expect(result).toStrictEqual({ done: true, value: undefined });
    }
  );

  test("returns { done: true, value: undefined } if wrapped async iterable does not have method", async () => {
    expect.assertions(1);

    let iterable = {
      [Symbol.asyncIterator]: () => ({
        next: () => ({ done: true })
      })
    };

    let icw = new ICW(iterable);
    let result = await icw.return("foo");
    expect(result).toStrictEqual({ done: true, value: undefined });
  });
});

describe('prototype method "throw"', () => {
  test.each`
    iteratorType | createIterableIterator
    ${"sync"}    | ${function*() {}}
    ${"async"}   | ${async function*() {}}
  `(
    "calls method on wrapped $iteratorType iterator, if it exists",
    async ({ createIterableIterator }) => {
      expect.assertions(1);

      let iterableIterator = createIterableIterator();
      let wrappedThrow = jest.spyOn(iterableIterator, "throw");

      let icw = new ICW(iterableIterator);
      let error = new Error("boom");

      try {
        await icw.throw(error);
      } catch (_) {
        expect(wrappedThrow).toHaveBeenCalledWith(error);
      }
    }
  );

  test.each`
    iteratorType | iteratorSymbol
    ${"sync"}    | ${Symbol.iterator}
    ${"async"}   | ${Symbol.asyncIterator}
  `(
    "throws error if wrapped $iteratorType iterator does not have method",
    async ({ iteratorSymbol }) => {
      expect.assertions(1);

      let iterable = {
        [iteratorSymbol]: () => ({
          next: () => ({ done: true })
        })
      };

      let icw = new ICW(iterable);
      let error = new Error("boom");

      await expect(icw.throw(error)).rejects.toThrowError(error);
    }
  );
});

describe.each`
  method         | runSuite
  ${"collect"}   | ${runCollectSuite}
  ${"drain"}     | ${runDrainSuite}
  ${"filter"}    | ${runFilterSuite}
  ${"first"}     | ${runFirstSuite}
  ${"forEach"}   | ${runForEachSuite}
  ${"head"}      | ${runHeadSuite}
  ${"map"}       | ${runMapSuite}
  ${"reject"}    | ${runRejectSuite}
  ${"scan"}      | ${runScanSuite}
  ${"skip"}      | ${runSkipSuite}
  ${"skipWhile"} | ${runSkipWhileSuite}
  ${"tail"}      | ${runTailSuite}
  ${"take"}      | ${runTakeSuite}
  ${"takeWhile"} | ${runTakeWhileSuite}
  ${"tap"}       | ${runTapSuite}
  ${"toArray"}   | ${runToArraySuite}
  ${"toPromise"} | ${runToPromiseSuite}
  ${"withIndex"} | ${runWithIndexSuite}
`("prototype method $method", ({ method, runSuite }) => {
  runSuite(bindMethod(method));
});

function bindMethod(method) {
  return function callBoundMethod(iterable, ...args) {
    return new ICW(iterable)[method](...args);
  };
}
