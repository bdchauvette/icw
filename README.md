<div align="center">
  <img src="assets/sailboat.svg" width="128" height="128" alt="A sailboat icon">
  <h2>icw</h2>
  <p><strong>A stream-like utility library for JavaScript iterators</strong></p>

[![0BSD License][license-badge]][license]
[![Build status][build-badge]][build]
[![Code coverage][coverage-badge]][coverage]

</div>

---

## Description

`icw` is a high-level JavaScript utility library for working with synchronous
and asynchronous iterators in a reactive, stream-like way. By using the
iterator interfaces as a common ground, `icw` allows you to use common
stream-like idioms with any data structure that implements `Symbol.iterator`
or `Symbol.asyncIterator`, including built-ins like strings and Arrays, as well
as libraries like [`@funkia/list`][] and [`immutable`][].

`icw` pairs especially well with Node.js v10's implementation of
`ReadableStream`, which has [experimental support][nodejs: readable-stream] for the
`Symbol.asyncIterator` interface.

## Installation

### Requirements

The `AsyncIterator` interface was added in ECMAScript 2018, so this library
requires a modern JavaScript runtime. We do not currently offer a transpiled
build to support older runtimes.

The library is tested against Node.js >=10, but see the
[node.green compatibility table][node.green] for more details on support for
asynchronous iterators in Node.js.

For a list of browsers that should support this, see
[Kangax's ECMAScript 2016+ compatibility table][kangax].

### Node.js

```sh
npm install --save @icw/icw
```

or

```
yarn add @icw/icw
```

## Design Goals & Philosophy

### Idiomatic JavaScript API

`icw` aims to be as idiomatic as possible, in the sense that the API should
closely match any existing native APIs for built-in JavaScript iterables. For
example, all functions are iterable-first, and functions that accept
callbacks &ndash; e.g. `map` and `filter` &ndash; should generally have an
optional final argument that allows users to set the `this` context for the
callback.

The library does not aim or intend to ever have a currying-friendly API.
Currying and data-last APIs are great, but there are some good arguments for
why they're not very idiomatic in JavaScript:

- [Currying is not idiomatic in JavaScript][2017-11-10 rauschmayer] by Dr Axel Rauschmayer
- [Does Curry help?][2016-01 jackson] by Hugh FD Jackson

### Performance

Performance is not currently a priority for this project. In the words of
[Johnson & Kernighan (1983)][1983-08 johnson and kernighan], 'the strategy is
definitely: first make it work, then make it right, and, finally, make it
fast.'

Moreover, because `icw` is asynchronous at its core, it will never approach
the peformance of a bare `for` loop, `Array#forEach`, or any library that
focuses exclusively on synchronous iteration.

In general, if your project involves a lot of async workflows, the high-level
nature of `icw` may be worth the trade-off in performance. If your only
iterating over synchronous iterators, however, you would probably be better
off using a library like [`lodash`][] or [`ramda`][] instead.

That's not to say you _can't_ use `icw` for heavily synchronous workloads.
But if you care about **Maximum Performance** :rocket:, the overhead of passing
a bunch of Promises around is probably not what you want.

## What's in a name?

> The Intracoastal Waterway (ICW) is a 3,000-mile (4,800 km) inland waterway
> along the Atlantic and Gulf of Mexico coasts of the United States
> [&hellip;] It provides a navigable route along its length without many of
> the hazards of travel on the open sea.
> &horbar; [Wikipedia][wikipedia: icw]

## See also

### Blog posts

- [Async iterators and generators][2017-04-18 archibald] by Jake Archibald
- [ES2018: Asynchronous iteration][2016-10-02 rauschmayer] by Dr Axel Rauschmayer
- [Async Iterators: These Promises Are Killing My Performance][2017-08-22 vanderkam] by Dan Vanderkam

### Similar libraries

- [`async-generators`][]
- [`@lorenzofox3/for-await`][]
- [`iterall`][]
- [`highland`][]

## License

[0BSD](https://tldrlegal.com/license/bsd-0-clause-license) &ndash; See [`LICENSE`][license] for details.

---

<div align="center">
  :whale:
</div>

<!-- Badges -->

[build-badge]: https://img.shields.io/travis/icwjs/icw.svg?style=flat-square
[build]: https://travis-ci.org/icwjs/icw
[coverage-badge]: https://img.shields.io/codecov/c/github/icwjs/icw.svg?style=flat-square
[coverage]: https://codecov.io/gh/icwjs/icw
[license-badge]: https://img.shields.io/badge/license-0BSD-brightgreen.svg?style=flat-square
[license]: LICENSE

<!-- Libraries -->

[`@funkia/list`]: https://github.com/funkia/list
[`@lorenzofox3/for-await`]: https://www.npmjs.com/package/@lorenzofox3/for-await
[`async-generators`]: https://github.com/async-generators/async-generators
[`highland`]: https://highlandjs.org/
[`immutable`]: http://facebook.github.io/immutable-js/
[`iterall`]: https://github.com/leebyron/iterall
[`lodash`]: https://lodash.com/
[`ramda`]: https://ramdajs.com/

<!-- Articles & blog posts -->

[1983-08 johnson and kernighan]: https://archive.org/details/byte-magazine-1983-08
[2016-01 jackson]: https://hughfdjackson.com/javascript/does-curry-help/
[2016-10-02 rauschmayer]: http://2ality.com/2016/10/asynchronous-iteration.html
[2017-04-18 archibald]: https://jakearchibald.com/2017/async-iterators-and-generators/
[2017-08-22 vanderkam]: https://medium.com/netscape/async-iterators-these-promises-are-killing-my-performance-4767df03d85b
[2017-11-10 rauschmayer]: http://2ality.com/2017/11/currying-in-js.html

<!-- References -->

[kangax]: http://kangax.github.io/compat-table/es2016plus/#test-Asynchronous_Iterators
[node.green]: https://node.green/#ES2018-features-Asynchronous-Iterators
[nodejs: readable-stream]: https://nodejs.org/api/stream.html#stream_readable_symbol_asynciterator
[wikipedia: icw]: https://en.wikipedia.org/wiki/Intracoastal_Waterway
