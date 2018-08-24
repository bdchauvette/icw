const {
  toBeCloseableAsyncIterator
} = require("../matchers/toBeCloseableAsyncIterator");

const {
  toEagerlyConsumeWrappedAsyncIterable
} = require("../matchers/toEagerlyConsumeWrappedAsyncIterable");

const {
  toEagerlyConsumeWrappedIterable
} = require("../matchers/toEagerlyConsumeWrappedIterable");

const {
  toLazilyConsumeWrappedAsyncIterable
} = require("../matchers/toLazilyConsumeWrappedAsyncIterable");

const {
  toLazilyConsumeWrappedIterable
} = require("../matchers/toLazilyConsumeWrappedIterable");

const {
  toReturnSameAsyncIterator
} = require("../matchers/toReturnSameAsyncIterator");

expect.extend({
  toBeCloseableAsyncIterator,
  toEagerlyConsumeWrappedAsyncIterable,
  toEagerlyConsumeWrappedIterable,
  toLazilyConsumeWrappedAsyncIterable,
  toLazilyConsumeWrappedIterable,
  toReturnSameAsyncIterator
});
