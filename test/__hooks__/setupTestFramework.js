const {
  toBeCloseableAsyncIterator
} = require("../matchers/toBeCloseableAsyncIterator");

const {
  toReturnSameAsyncIterator
} = require("../matchers/toReturnSameAsyncIterator");

expect.extend({
  toBeCloseableAsyncIterator,
  toReturnSameAsyncIterator
});
