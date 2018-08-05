import { AsyncDelegator } from "../src/__internal__/AsyncDelegator";
import { from } from "../src/from";
import { fromSuite } from "./suites/fromSuite";

test("is a function", () => {
  expect.assertions(1);
  expect(from).toBeFunction();
});

test("returns original input if it's already an async iterable", async () => {
  expect.assertions(2);
  let input = new AsyncDelegator([1, 2, 3]);
  await expect(from(input)).toBeAsyncIterable();
  expect(from(input)).toBe(input);
});

fromSuite(from);
