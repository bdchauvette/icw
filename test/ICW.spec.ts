import { ICW } from "../src/ICW";
import { runOfSuite } from "./suites/runOfSuite";
import { runFromSuite } from "./suites/runFromSuite";

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
  });

  ofSuite(ICW.of);
});
});
