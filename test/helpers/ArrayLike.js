export class ArrayLike {
  constructor(...args) {
    this.length = args.length;
    args.forEach((arg, index) => (this[index] = arg));
  }
}
