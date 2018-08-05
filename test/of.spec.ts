import { of } from "../src/of";
import { ofSuite } from "./suites/ofSuite";

test("is a function", () => {
  expect.assertions(1);
  expect(of).toBeFunction();
});

ofSuite(of);
