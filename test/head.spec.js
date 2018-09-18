import { head } from "../src/head";

import { first } from "../src/first";

test("is an alias for `first`", () => {
  expect.assertions(1);
  expect(head).toBe(first);
});
