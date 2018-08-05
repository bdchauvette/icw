import { ICW } from "../src/ICW";
import { ofSuite } from "./suites/ofSuite";
import { fromSuite } from "./suites/fromSuite";

test("is a class", () => {
  expect.assertions(2);
  expect(ICW).toBeFunction();
  expect(String(ICW)).toMatch(/^class/);
});

test("is an async iterable", async () => {
  expect.assertions(1);
  await expect(new ICW([])).toBeAsyncIterable();
});

interface StaticMethodTableColumns {
  method: Exclude<keyof typeof ICW, "prototype">;
  runSuite: Function;
}

describe.each`
  method    | runSuite     | args
  ${"from"} | ${fromSuite} | ${[]}
  ${"of"}   | ${ofSuite}   | ${[]}
`("$method", ({ method, runSuite }: StaticMethodTableColumns) => {
  test("is a function", () => {
    expect.assertions(1);
    expect(ICW[method]).toBeFunction();
  });

  test("returns an ICW instance", () => {
    expect.assertions(1);
    let returnValue = (ICW as any)[method]([]);
    expect(returnValue).toBeInstanceOf(ICW);
  });

  runSuite(ICW[method]);
});
