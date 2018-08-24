import { of } from "../../src";

export function runDrainSuite(drain) {
  test("eagerly consumes wrapped async iterable", async () => {
    expect.assertions(1);
    await expect(_ => drain(_)).toEagerlyConsumeWrappedAsyncIterable();
  });

  test("eagerly consumes wrapped sync iterable", async () => {
    expect.assertions(1);
    await expect(_ => drain(_)).toEagerlyConsumeWrappedIterable();
  });

  test("runs the provided iterable to completion", async () => {
    expect.assertions(1);

    let input = of(1, 2, 3);
    let next = jest.spyOn(input, "next");

    await drain(input);
    expect(next).toHaveBeenCalledTimes(4);
  });
}
