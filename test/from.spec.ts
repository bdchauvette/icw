import { DelegatingAsyncIterable } from "../src/__internal__/DelegatingAsyncIterable";
import { from } from "../src/from";
import { runFromSuite } from "./suites/runFromSuite";

test("returns original input if it's already an async iterable", async () => {
  expect.assertions(2);
  let input = new DelegatingAsyncIterable([1, 2, 3]);
  await expect(from(input)).toBeAsyncIterable();
  expect(from(input)).toBe(input);
});

runFromSuite(from);
