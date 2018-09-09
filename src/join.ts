import { IterableLike } from "./IterableLike";
import { intersperse } from "./intersperse";

export async function join<T>(
  iterableLike: IterableLike<T>,
  separator = ","
): Promise<string> {
  let joinedValues = "";

  for await (let value of intersperse(iterableLike, separator)) {
    joinedValues += String(value);
  }

  return joinedValues;
}
