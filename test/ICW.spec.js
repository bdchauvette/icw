import { ICW } from "../src";

import { runFromSuite } from "./suites/runFromSuite";
import { runOfSuite } from "./suites/runOfSuite";

import { runCollectSuite } from "./suites/runCollectSuite";
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

describe.each`
  method         | runSuite
  ${"collect"}   | ${runCollectSuite}
  ${"drain"}     | ${runDrainSuite}
  ${"filter"}    | ${runFilterSuite}
  ${"forEach"}   | ${runForEachSuite}
  ${"map"}       | ${runMapSuite}
  ${"reject"}    | ${runRejectSuite}
  ${"scan"}      | ${runScanSuite}
  ${"skip"}      | ${runSkipSuite}
  ${"skipWhile"} | ${runSkipWhileSuite}
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
