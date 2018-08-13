import { ICW } from "../src";
import { isEven } from "./helpers/isEven";
import { noop } from "./helpers/noop";
import { sum } from "./helpers/sum";

import { runFromSuite } from "./suites/runFromSuite";
import { runOfSuite } from "./suites/runOfSuite";

import { runDrainSuite } from "./suites/runDrainSuite";
import { runFilterSuite } from "./suites/runFilterSuite";
import { runForEachSuite } from "./suites/runForEachSuite";
import { runMapSuite } from "./suites/runMapSuite";
import { runRejectSuite } from "./suites/runRejectSuite";
import { runScanSuite } from "./suites/runScanSuite";
import { runSkipSuite } from "./suites/runSkipSuite";
import { runSkipWhileSuite } from "./suites/runSkipWhileSuite";
import { runTakeSuite } from "./suites/runTakeSuite";
import { runTakeWhileSuite } from "./suites/runTakeWhileSuite";
import { runTapSuite } from "./suites/runTapSuite";
import { runWithIndexSuite } from "./suites/runWithIndexSuite";

test("is a class", () => {
  expect.assertions(2);
  expect(ICW).toBeFunction();
  expect(String(ICW)).toMatch(/^class/);
});

test("is an async iterable", async () => {
  expect.assertions(1);
  await expect(new ICW([])).toBeAsyncIterable();
});

describe.each`
  method    | args        | runSuite
  ${"of"}   | ${[]}       | ${runOfSuite}
  ${"from"} | ${[isEven]} | ${runFromSuite}
`("static method $method", ({ method, args, runSuite }) => {
  test("is a function", () => {
    expect.assertions(1);
    expect(ICW[method]).toBeFunction();
  });

  test("returns an ICW instance", () => {
    expect.assertions(1);
    expect(ICW[method](...args)).toBeInstanceOf(ICW);
  });

  runSuite(ICW[method]);
});

describe.each`
  method         | args         | returnInstance | runSuite
  ${"drain"}     | ${[]}        | ${Promise}     | ${runDrainSuite}
  ${"filter"}    | ${[isEven]}  | ${ICW}         | ${runFilterSuite}
  ${"forEach"}   | ${[noop]}    | ${Promise}     | ${runForEachSuite}
  ${"map"}       | ${[noop]}    | ${ICW}         | ${runMapSuite}
  ${"reject"}    | ${[isEven]}  | ${ICW}         | ${runRejectSuite}
  ${"scan"}      | ${[sum]}     | ${ICW}         | ${runScanSuite}
  ${"skip"}      | ${[1]}       | ${ICW}         | ${runSkipSuite}
  ${"skipWhile"} | ${[Boolean]} | ${ICW}         | ${runSkipWhileSuite}
  ${"take"}      | ${[1]}       | ${ICW}         | ${runTakeSuite}
  ${"takeWhile"} | ${[Boolean]} | ${ICW}         | ${runTakeWhileSuite}
  ${"tap"}       | ${[noop]}    | ${ICW}         | ${runTapSuite}
  ${"withIndex"} | ${[]}        | ${ICW}         | ${runWithIndexSuite}
`("prototype method $method", ({ method, args, returnInstance, runSuite }) => {
  test("is a function", () => {
    expect.assertions(1);
    expect(ICW.prototype[method]).toBeFunction();
  });

  test(`returns a ${returnInstance.name} instance`, () => {
    expect.assertions(1);
    let icw = new ICW([1, 2, 3]);
    expect(icw[method](...args)).toBeInstanceOf(returnInstance);
  });

  runSuite(bindMethod(method));
});

function bindMethod(method) {
  return function callBoundMethod(iterable, ...args) {
    return new ICW(iterable)[method](...args);
  };
}
