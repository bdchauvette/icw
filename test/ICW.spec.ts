import { ICW } from "../src/ICW";
import { noop } from "./helpers/noop";
import { runOfSuite } from "./suites/runOfSuite";
import { runFromSuite } from "./suites/runFromSuite";
import { runConsumeSuite } from "./suites/runConsumeSuite";
import { runMapSuite } from "./suites/runMapSuite";
import { runWithIndexSuite } from "./suites/runWithIndexSuite";

const bindMethod = <T>(method: keyof ICW<T>) => (
  iterable: Iterable<T> | AsyncIterable<T>,
  ...args: any[]
): any => {
  // @ts-ignore
  return new ICW(iterable)[method](...args);
};

test("is a class", () => {
  expect.assertions(2);
  expect(ICW).toBeFunction();
  expect(String(ICW)).toMatch(/^class/);
});

test("is an async iterable", async () => {
  expect.assertions(1);
  await expect(new ICW([])).toBeAsyncIterable();
});

describe("::from", () => {
  test("is a function", () => {
    expect.assertions(1);
    expect(ICW.from).toBeFunction();
  });

  test("returns an ICW instance", () => {
    expect.assertions(1);
    expect(ICW.from([])).toBeInstanceOf(ICW);
  });

  runFromSuite(ICW.from);
});

describe("::of", () => {
  test("is a function", () => {
    expect.assertions(1);
    expect(ICW.of).toBeFunction();
  });

  test("returns an ICW instance", () => {
    expect.assertions(1);
    expect(ICW.of()).toBeInstanceOf(ICW);
  });

  runOfSuite(ICW.of);
});

describe("#consume", () => {
  test("is a function", () => {
    expect.assertions(1);
    expect(ICW.prototype.consume).toBeFunction();
  });

  test("returns a Promise", () => {
    expect.assertions(1);
    expect(new ICW([]).consume()).toBeInstanceOf(Promise);
  });

  runConsumeSuite(bindMethod("consume"));
});

describe("#map", () => {
  test("is a function", () => {
    expect.assertions(1);
    expect(ICW.prototype.map).toBeFunction();
  });

  test("returns an ICW instance", () => {
    expect.assertions(1);
    expect(new ICW([]).map(noop)).toBeInstanceOf(ICW);
  });

  runMapSuite(bindMethod("map"));
});

describe("#withIndex", () => {
  test("is a function", () => {
    expect.assertions(1);
    expect(ICW.prototype.withIndex).toBeFunction();
  });

  test("returns an ICW instance", () => {
    expect.assertions(1);
    expect(new ICW([]).withIndex()).toBeInstanceOf(ICW);
  });

  runWithIndexSuite(bindMethod("withIndex"));
});
