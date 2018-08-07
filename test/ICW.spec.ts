import { ICW } from "../src/ICW";
import { isEven } from "./helpers/isEven";
import { noop } from "./helpers/noop";
import { runOfSuite } from "./suites/runOfSuite";
import { runFromSuite } from "./suites/runFromSuite";
import { runConsumeSuite } from "./suites/runConsumeSuite";
import { runFilterSuite } from "./suites/runFilterSuite";
import { runMapSuite } from "./suites/runMapSuite";
import { runWithIndexSuite } from "./suites/runWithIndexSuite";
import { runRejectSuite } from "./suites/runRejectSuite";

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

describe("#filter", () => {
  test("is a function", () => {
    expect.assertions(1);
    expect(ICW.prototype.reject).toBeFunction();
  });

  test("returns an ICW instance", () => {
    expect.assertions(1);
    expect(new ICW([]).filter(isEven)).toBeInstanceOf(ICW);
  });

  runFilterSuite(bindMethod("filter"));
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

describe("#reject", () => {
  test("is a function", () => {
    expect.assertions(1);
    expect(ICW.prototype.reject).toBeFunction();
  });

  test("returns an ICW instance", () => {
    expect.assertions(1);
    expect(new ICW([]).reject(isEven)).toBeInstanceOf(ICW);
  });

  runRejectSuite(bindMethod("reject"));
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
