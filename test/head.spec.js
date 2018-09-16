import { first } from "../src/first";
import { head } from "../src/head";

test("is an alias for `first`", () => {
  expect.assertions(1);
  expect(head).toBe(first);
});
