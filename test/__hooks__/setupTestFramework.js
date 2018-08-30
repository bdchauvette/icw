const {
  toBeCloseableAsyncIterator
} = require("../matchers/toBeCloseableAsyncIterator");

const {
  toEagerlyConsumeWrappedAsyncIterable
} = require("../matchers/toEagerlyConsumeWrappedAsyncIterable");

const {
  toLazilyConsumeWrappedAsyncIterable
} = require("../matchers/toLazilyConsumeWrappedAsyncIterable");

const {
  toReturnSameAsyncIterator
} = require("../matchers/toReturnSameAsyncIterator");

expect.extend({
  toBeCloseableAsyncIterator,
  toEagerlyConsumeWrappedAsyncIterable,
  toLazilyConsumeWrappedAsyncIterable,
  toReturnSameAsyncIterator
});
