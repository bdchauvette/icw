import { ICW } from "../src/ICW";
import { of } from "../src/of";

// plop: Import suites
import { runConcatSuite } from "./suites/runConcatSuite";
import { runDrainSuite } from "./suites/runDrainSuite";
import { runEverySuite } from "./suites/runEverySuite";
import { runFilterSuite } from "./suites/runFilterSuite";
import { runFindIndexSuite } from "./suites/runFindIndexSuite";
import { runFindLastIndexSuite } from "./suites/runFindLastIndexSuite";
import { runFindLastSuite } from "./suites/runFindLastSuite";
import { runFindSuite } from "./suites/runFindSuite";
import { runFirstSuite } from "./suites/runFirstSuite";
import { runFlatMapSuite } from "./suites/runFlatMapSuite";
import { runFlatSuite } from "./suites/runFlatSuite";
import { runForEachSuite } from "./suites/runForEachSuite";
import { runFromSuite } from "./suites/runFromSuite";
import { runHeadSuite } from "./suites/runHeadSuite";
import { runIncludesSuite } from "./suites/runIncludesSuite";
import { runIndexOfSuite } from "./suites/runIndexOfSuite";
import { runIntersperseSuite } from "./suites/runIntersperseSuite";
import { runLastIndexOfSuite } from "./suites/runLastIndexOfSuite";
import { runLastSuite } from "./suites/runLastSuite";
import { runMapSuite } from "./suites/runMapSuite";
import { runNthSuite } from "./suites/runNthSuite";
import { runOfSuite } from "./suites/runOfSuite";
import { runReduceSuite } from "./suites/runReduceSuite";
import { runRejectSuite } from "./suites/runRejectSuite";
import { runScanSuite } from "./suites/runScanSuite";
import { runSkipLastSuite } from "./suites/runSkipLastSuite";
import { runSkipSuite } from "./suites/runSkipSuite";
import { runSkipWhileSuite } from "./suites/runSkipWhileSuite";
import { runSomeSuite } from "./suites/runSomeSuite";
import { runTailSuite } from "./suites/runTailSuite";
import { runTakeLastSuite } from "./suites/runTakeLastSuite";
import { runTakeSuite } from "./suites/runTakeSuite";
import { runTakeWhileSuite } from "./suites/runTakeWhileSuite";
import { runTapSuite } from "./suites/runTapSuite";
import { runToArraySuite } from "./suites/runToArraySuite";
import { runWithIndexSuite } from "./suites/runWithIndexSuite";
// plop-end

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
  prototypeMethod    | runSuite
  ${"concat"}        | ${runConcatSuite}
  ${"drain"}         | ${runDrainSuite}
  ${"every"}         | ${runEverySuite}
  ${"filter"}        | ${runFilterSuite}
  ${"find"}          | ${runFindSuite}
  ${"findIndex"}     | ${runFindIndexSuite}
  ${"findLast"}      | ${runFindLastSuite}
  ${"findLastIndex"} | ${runFindLastIndexSuite}
  ${"first"}         | ${runFirstSuite}
  ${"flat"}          | ${runFlatSuite}
  ${"flatMap"}       | ${runFlatMapSuite}
  ${"forEach"}       | ${runForEachSuite}
  ${"head"}          | ${runHeadSuite}
  ${"includes"}      | ${runIncludesSuite}
  ${"indexOf"}       | ${runIndexOfSuite}
  ${"intersperse"}   | ${runIntersperseSuite}
  ${"last"}          | ${runLastSuite}
  ${"lastIndexOf"}   | ${runLastIndexOfSuite}
  ${"map"}           | ${runMapSuite}
  ${"nth"}           | ${runNthSuite}
  ${"reduce"}        | ${runReduceSuite}
  ${"reject"}        | ${runRejectSuite}
  ${"scan"}          | ${runScanSuite}
  ${"skip"}          | ${runSkipSuite}
  ${"skipLast"}      | ${runSkipLastSuite}
  ${"skipWhile"}     | ${runSkipWhileSuite}
  ${"some"}          | ${runSomeSuite}
  ${"tail"}          | ${runTailSuite}
  ${"take"}          | ${runTakeSuite}
  ${"takeLast"}      | ${runTakeLastSuite}
  ${"takeWhile"}     | ${runTakeWhileSuite}
  ${"tap"}           | ${runTapSuite}
  ${"toArray"}       | ${runToArraySuite}
  ${"withIndex"}     | ${runWithIndexSuite}
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
