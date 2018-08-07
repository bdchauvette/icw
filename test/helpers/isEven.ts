export const isEven = (n: number) => !!(n % 2 === 0);
export const isEvenAsync = async (n: number) => isEven(n);
