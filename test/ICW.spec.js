import { ICW, of } from "../src";

// $plop: Import suites
import { runDrainSuite } from "./suites/runDrainSuite";
import { runEverySuite } from "./suites/runEverySuite";
import { runFilterSuite } from "./suites/runFilterSuite";
import { runFindSuite } from "./suites/runFindSuite";
import { runFindIndexSuite } from "./suites/runFindIndexSuite";
import { runFirstSuite } from "./suites/runFirstSuite";
import { runForEachSuite } from "./suites/runForEachSuite";
import { runFromSuite } from "./suites/runFromSuite";
import { runHeadSuite } from "./suites/runHeadSuite";
import { runIndexOfSuite } from "./suites/runIndexOfSuite";
import { runLastSuite } from "./suites/runLastSuite";
import { runLastIndexOfSuite } from "./suites/runLastIndexOfSuite";
import { runMapSuite } from "./suites/runMapSuite";
import { runNthSuite } from "./suites/runNthSuite";
import { runOfSuite } from "./suites/runOfSuite";
import { runReduceSuite } from "./suites/runReduceSuite";
import { runRejectSuite } from "./suites/runRejectSuite";
import { runScanSuite } from "./suites/runScanSuite";
import { runSkipSuite } from "./suites/runSkipSuite";
import { runSkipWhileSuite } from "./suites/runSkipWhileSuite";
import { runSomeSuite } from "./suites/runSomeSuite";
import { runTailSuite } from "./suites/runTailSuite";
import { runTakeSuite } from "./suites/runTakeSuite";
import { runTakeWhileSuite } from "./suites/runTakeWhileSuite";
import { runTapSuite } from "./suites/runTapSuite";
import { runToArraySuite } from "./suites/runToArraySuite";
import { runWithIndexSuite } from "./suites/runWithIndexSuite";

describe.each`
  staticMethod | runSuite
  ${"of"}      | ${runOfSuite}
  ${"from"}    | ${runFromSuite}
`("static method $staticMethod", ({ staticMethod, runSuite }) => {
  runSuite(ICW[staticMethod]);
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

  test("throws an error if no iterable-like value is provided", () => {
    expect.assertions(1);
    expect(() => new ICW(null)).toThrowErrorMatchingInlineSnapshot(
      `"Must provide an iterable, an Array-like value, or a Promise."`
    );
  });
});

describe("prototype method [Symbol.asyncIterator]", () => {
  test("returns itself", () => {
    expect.assertions(1);
    let icw = new ICW(of());
    expect(icw[Symbol.asyncIterator]()).toBe(icw);
  });

  test("returns same async iterator", () => {
    expect.assertions(1);
    expect(new ICW(of())).toReturnSameAsyncIterator();
  });
});

describe('prototype method "next"', () => {
  test("calls method on wrapped $iteratorType iterator", async () => {
    expect.assertions(1);

    let icw = new ICW(of());
    let iterator = getIterator(icw);
    let wrappedNext = jest.spyOn(iterator, "next");

    await icw.next("foo");
    expect(wrappedNext).toHaveBeenCalledWith("foo");
  });
});

describe('prototype method "return"', () => {
  test("calls method on wrapped iterator", async () => {
    expect.assertions(1);

    let icw = new ICW(of());
    let iterator = getIterator(icw);
    let wrappedReturn = jest.spyOn(iterator, "return");

    await icw.return("foo");
    expect(wrappedReturn).toHaveBeenCalledWith("foo");
  });
});

describe('prototype method "throw"', () => {
  test("calls method on wrapped iterator", async () => {
    expect.assertions(1);

    let icw = new ICW(of());
    let iterator = getIterator(icw);
    let wrappedThrow = jest.spyOn(iterator, "throw");

    let error = new Error("boom");

    try {
      await icw.throw(error);
    } catch (_) {
      expect(wrappedThrow).toHaveBeenCalledWith(error);
    }
  });
});

describe.each`
  prototypeMethod  | runSuite
  ${"lastIndexOf"} | ${runLastIndexOfSuite}
  ${"indexOf"}     | ${runIndexOfSuite}
  ${"drain"}       | ${runDrainSuite}
  ${"every"}       | ${runEverySuite}
  ${"filter"}      | ${runFilterSuite}
  ${"find"}        | ${runFindSuite}
  ${"findIndex"}   | ${runFindIndexSuite}
  ${"first"}       | ${runFirstSuite}
  ${"forEach"}     | ${runForEachSuite}
  ${"head"}        | ${runHeadSuite}
  ${"last"}        | ${runLastSuite}
  ${"map"}         | ${runMapSuite}
  ${"nth"}         | ${runNthSuite}
  ${"reduce"}      | ${runReduceSuite}
  ${"reject"}      | ${runRejectSuite}
  ${"scan"}        | ${runScanSuite}
  ${"skip"}        | ${runSkipSuite}
  ${"skipWhile"}   | ${runSkipWhileSuite}
  ${"some"}        | ${runSomeSuite}
  ${"tail"}        | ${runTailSuite}
  ${"take"}        | ${runTakeSuite}
  ${"takeWhile"}   | ${runTakeWhileSuite}
  ${"tap"}         | ${runTapSuite}
  ${"toArray"}     | ${runToArraySuite}
  ${"withIndex"}   | ${runWithIndexSuite}
`("prototype method $prototypeMethod", ({ prototypeMethod, runSuite }) => {
  runSuite(bindMethod(prototypeMethod));
});

function bindMethod(method) {
  return function callBoundMethod(iterable, ...args) {
    return new ICW(iterable)[method](...args);
  };
}

function getIterator(icw) {
  let symbols = Object.getOwnPropertySymbols(icw);
  let _iterator = symbols.find(
    symbol => String(symbol) === "Symbol(_iterator)"
  );
  return icw[_iterator];
}
