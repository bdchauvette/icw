<div align="center">
  <img src="assets/sailboat.png" width="96" height="96" alt="A sailboat icon">
  <h1>icw</h2>
  <p><strong>A stream-like utility library for JavaScript iterators</strong></p>
</div>

## Description

`icw` is a high-level JavaScript utility library for working with synchronous
and asynchronous iterators in a reactive, stream-like way. By using the
iterator interfaces as a common ground, `icw` allows you to use common
stream-like idioms with any data structure that implements `Symbol.iterator`
or `Symbol.asyncIterator`, including built-ins like strings and Arrays, as well
as libraries like [`@funkia/list`][] and [`immutable`][].

`icw` pairs especially well with Node.js v10's implementation of
`ReadableStream`, which has [experimental support][] for the
`Symbol.asyncIterator` interface.

[`@funkia/list`]: https://github.com/funkia/list
[`immutable`]: http://facebook.github.io/immutable-js/
[experimental support]: https://nodejs.org/api/stream.html#stream_readable_symbol_asynciterator

## Installation

### Requirements

The `AsyncIterator` interface was added in ECMAScript 2018, so this library
requires a modern JavaScript runtime. We do not currently offer a transpiled
build to support older runtimes.

The library is tested against Node.js >=10, but see the [node.green
compatibility table][] for more details on support for asynchronous iterators
in Node.js.

For a list of browsers that should support this, see [Kangax's ECMAScript 2016+ compatibility table][].

[node.green compatibility table]: https://node.green/#ES2018-features-Asynchronous-Iterators
[kangax's ecmascript 2016+ compatibility table]: http://kangax.github.io/compat-table/es2016plus/#test-Asynchronous_Iterators

### Node.js

```sh
npm install --save @icw/icw
```

or

```
yarn add @icw/icw
```

## Performance

Performance is not currently a priority for this project. In the words of
[Johnson & Kernighan (1983)][], 'the strategy is definitely: first make it
work, then make it right, and, finally, make it fast.'

Moreover, because `icw` is asynchronous at its core, it will never approach
the peformance of a bare `for` loop, `Array#forEach`, or any library that
focuses exclusively on synchronous iteration.

In general, if your project involves a lot of async workflows, the high-level
nature of `icw` may be worth the trade-off in performance. If your only
iterating over synchronous iterators, however, you would probably be better
off using a library like [`iterall`][] instead.

That's not to say you _can't_ use `icw` for heavily synchronous workloads.
But if you care about **Maximum Performance** :rocket:, the overhead of passing
a bunch of Promises around is probably not what you want.

[johnson & kernighan (1983)]: https://archive.org/details/byte-magazine-1983-08

## What's in a name?

> The Intracoastal Waterway (ICW) is a 3,000-mile (4,800 km) inland waterway
> along the Atlantic and Gulf of Mexico coasts of the United States
> [&hellip;] It provides a navigable route along its length without many of
> the hazards of travel on the open sea.
> &horbar; [Wikipedia](https://en.wikipedia.org/wiki/Intracoastal_Waterway)

## See also

### Blog posts

- [Async iterators and generators][] by Jake Archibald
- [ES2018: Asynchronous iteration][] by Dr Axel Rauschmayer
- [Async Iterators: These Promises Are Killing My Performance][] by Dan Vanderkam

[async iterators and generators]: https://jakearchibald.com/2017/async-iterators-and-generators/
[es2018: asynchronous iteration]: http://2ality.com/2016/10/asynchronous-iteration.html
[async iterators: these promises are killing my performance]: https://medium.com/netscape/async-iterators-these-promises-are-killing-my-performance-4767df03d85b

### Similar libraries

- [`async-generators][]
- [`@lorenzofox3/for-await`][]
- [`iterall`][]
- [`highland`][]

- [`async-generators`]: https://github.com/async-generators/async-generators
  [`@lorenzofox3/for-await`]: https://www.npmjs.com/package/@lorenzofox3/for-await
  [`iterall`]: https://github.com/leebyron/iterall
  [`highland`]: https://highlandjs.org/

---

## License

[0BSD](https://tldrlegal.com/license/bsd-0-clause-license) &ndash; See [`LICENSE`](LICENSE) for details.

---

<div align="center">
  :sailboat: 
</div>
