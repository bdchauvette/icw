export function isSameValueZero(a: any, b: any): boolean {
  return a === b || (Number.isNaN(a) && Number.isNaN(b));
}
