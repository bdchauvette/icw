import { of } from "../../src/of";

export function runDrainSuite(drain) {
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
}
