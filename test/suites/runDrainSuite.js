export function runDrainSuite(drain) {
  test("returns a Promise", async () => {
    expect.assertions(1);
    expect(drain([])).toBeInstanceOf(Promise);
  });

  test.each`
    iterableType | iteratorSymbol          | iterator
    ${"sync"}    | ${Symbol.iterator}      | ${function*() {}}
    ${"async"}   | ${Symbol.asyncIterator} | ${async function*() {}}
  `(
    "eagerly consumes the provided $iterableType iterable",
    async ({ iteratorSymbol, iterator }) => {
      expect.assertions(1);
      let iterable = { [iteratorSymbol]: jest.fn(iterator) };

      await drain(iterable);
      expect(iterable[iteratorSymbol]).toHaveBeenCalled();
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
