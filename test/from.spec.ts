import { from } from "../src";
import { runFromSuite } from "./suites/runFromSuite";

test("returns original input if it's already an async iterable", async () => {
  expect.assertions(2);

  let input = {
    async *[Symbol.asyncIterator]() {
      yield true;
    }
  };

  await expect(from(input)).toBeAsyncIterable();
  expect(from(input)).toBe(input);
});

runFromSuite(from);
