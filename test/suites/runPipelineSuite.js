import { filter } from "../../src/filter";
import { of } from "../../src/of";
import { map } from "../../src/map";
import { toArray } from "../../src/toArray";

export function runPipelineSuite(pipeline) {
  test("throws an error when called with a non-function argument", () => {
    expect.assertions(1);
    expect(() => pipeline()).toThrowErrorMatchingInlineSnapshot(
      `"Must provide at least one function"`
    );
  });

  test("works with a single function", async () => {
    expect.assertions(1);
    let runPipeline = pipeline(n => n * 2);
    expect(runPipeline(1)).toStrictEqual(2);
  });

  test("calls the first function with all of the arguments provided to the caller", async () => {
    expect.assertions(1);
    let mockFn = jest.fn();
    pipeline(mockFn)("foo");
    expect(mockFn).toHaveBeenCalledWith("foo");
  });

  test("calls the tail functions with the output of the previous step", async () => {
    expect.assertions(3);

    let mockFn1 = jest.fn().mockReturnValue("foo");
    let mockFn2 = jest.fn().mockReturnValue("bar");
    let mockFn3 = jest.fn().mockReturnValue("baz");
    let mockFn4 = jest.fn();

    pipeline(mockFn1, mockFn2, mockFn3, mockFn4)();

    expect(mockFn2).toHaveBeenCalledWith("foo");
    expect(mockFn3).toHaveBeenCalledWith("bar");
    expect(mockFn4).toHaveBeenCalledWith("baz");
  });

  test("works with ICW methods", async () => {
    expect.assertions(1);

    let runPipeline = pipeline(
      of,
      _ => filter(_, n => n % 2 === 0),
      _ => map(_, n => n ** 2),
      toArray
    );

    await expect(runPipeline(1, 2, 3, 4, 5)).resolves.toStrictEqual([4, 16]);
  });
}
