export function runDrainSuite(drain) {
  test.each`
    iterableType | createIterableIterator
    ${"sync"}    | ${function*() {}}
    ${"async"}   | ${async function*() {}}
  `(
    "eagerly consumes the provided $iterableType iterable",
    async ({ createIterableIterator }) => {
      expect.assertions(1);

      let iterableIterator = createIterableIterator();
      let next = jest.spyOn(iterableIterator, "next");

      await drain(iterableIterator);
      expect(next).toHaveBeenCalled();
    }
  );

  test("runs the provided iterable to completion", async () => {
    expect.assertions(1);

    let iteratorDidFinish = false;

    await drain(
      (function*() {
        yield* [1, 2, 3];
        iteratorDidFinish = true;
      })()
    );

    expect(iteratorDidFinish).toBeTruthy();
  });

  test("runs the provided async iterable to completion", async () => {
    expect.assertions(1);

    let iteratorDidFinish = false;

    await drain(
      (async function*() {
        yield* [1, 2, 3];
        iteratorDidFinish = true;
      })()
    );

    expect(iteratorDidFinish).toBeTruthy();
  });
}
