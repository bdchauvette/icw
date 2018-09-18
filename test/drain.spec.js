import { drain } from "../src/drain";

import { of } from "../src/of";

test("rejects on non-IterableLike input", async () => {
  expect.assertions(2);
  try {
    await drain(null);
  } catch (error) {
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toMatchInlineSnapshot(
      `"Must provide an iterable, async iterable, Array-like value, or a Promise."`
    );
  }
});

test("eagerly consumes wrapped IterableLike input", async () => {
  expect.assertions(1);
  await expect(_ => drain(_)).toEagerlyConsumeWrappedAsyncIterable();
});

test("runs the provided iterableLike to completion", async () => {
  expect.assertions(1);

  let input = of(1, 2, 3);
  let next = jest.spyOn(input, "next");

  await drain(input);
  expect(next).toHaveBeenCalledTimes(4);
});

// TODO: Add tests for each iterable-like input type
