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

    let iterator = of(1, 2, 3);
    let next = jest.spyOn(iterator, "next");

    await drain(iterator);
    expect(next).toHaveBeenCalledTimes(4);
  });
}
