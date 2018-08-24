# Contributing Guidelines

Howdy! Thank you so much for taking the time to contribute to `icw`! 🙇

This document outlines a set of guidelines for contributing to the project.
It's designed to make sure we're all on the same page, and to streamline the
contribution process and (hopefully) reduce noise and churn in PRs.

Let's get started!

- [Bugs and Feature Requests](#bugs-and-feature-requests)
- [Opening a PR](#opening-a-pr)
  - [Helpful scripts](#helpful-scripts)
  - [Git hooks](#git-hooks)
- [Documentation](#documentation)
  - [Translating](#translating)
- [Code](#code)
  - [Fixing a bug](#fixing-a-bug)
  - [Adding a feature](#adding-a-feature)
  - [Tests](#tests)
  - [Style](#style)
- [Security](#security)

---

## Bug Reports and Feature Requests

Please open an issue if you have found a bug or would like to request a new
feature.

[As discussed below](#adding-a-feature), please do not open a PR for new features until it has
already been discussed in an issue.

## Opening a PR

- fork the repo
- clone your forked repo
- run `npm install`
- create a new branch with a `pr/` prefix, e.g. `pr/my-awesome-new-feature`

### Helpful scripts

```sh
# Run tests
npm test
```

```sh
# Build the package
npm run build
```

```sh
# Delete build files
npm run clean
```

```sh
# Lint the files
npm run lint
```

### Git hooks

`icw` uses [`husky`][] to run scripts on various git hooks. These should be
installed automatically during the `npm install` process.

#### `commit-msg`

Commit messages are linted using [`commitlint`][] with the [`@commitlint/config-conventional` preset][].

#### `pre-commit`

Staged files are linted using [`lint-staged`][]. Any linting errors will
prevent the staged files from being committed.

[`husky`]: https://github.com/typicode/husky
[`commitlint`]: https://github.com/marionebl/commitlint
[`@commitlint/config-conventional`]: https://github.com/marionebl/commitlint/tree/master/%40commitlint/config-conventional
[`lint-staged`]: https://github.com/okonet/lint-staged

## Documentation

Good documentation is the unsung hero of open source software, and writing
good, clear documentation is an underappreciated art. From the bottom of my
heart, thank you so much for helping to improve the docs, and make it easier
for everyone else to learn how to use `icw` :heart:

The only firm rule for documentation is that it should follow standard
American English spelling. Everything else can be workshopped in a PR.

If your PR is exclusively about documentation, feel free to open it without
first filing an issue. I think that if the documentation is wrong,
inadequate, or confusing enough to make you want to open a PR, then we should
fast track it and try to get it fixed as quickly as possible.

**If you find the docs wrong or confusing, but do not feel
comfortable opening a PR to fix it**, please open an issue pointing out what
needs to be fixed, and we'll do our best to get it fixed.

### Translating

Translating the documentation into other languages would be greatly
appreciated!

We currently do not have any guidelines or processes in place for how to
translate the docs, so feel free to offer any suggestions in your PR.

## Code

### Fixing a bug

If you've found a bug and know how to fix it, feel free to skip the issue
queue and open a PR directly.

In your PR (or issue), please try to provide a code snippet, a live demo, or a link to a
gist that illustrates the problem.

### Adding a feature

> If you would like to add a new feature to `icw`, **please open an issue
> first**.

A feature PR without an issue won't be rejected outright, but there is a
higher chance that the new feature will be rejected because it doesn't fit
the goals of the project. It will save everyone some time and effort if we
can discuss the feature and its proposed implementation before you write any
code.

That being said, the process that I generally use when adding a new (function|method|combinator|operator|_whatever_) is:

1. Create a new file for your function at the root level of the `src` folder,
   e.g. `src/myNewFunction.ts`

1. Create your new function as a _named_ export, and using a `function` keyword ([see style section](#style))

1. Add a new method to the class in [the `ICW.js` file][] that imports and
   wraps the standalone function from step 1

1. Write tests ([see next section](#tests))

In general, new iterable functions should:

- return something that implements the `AsyncIterableIterator` interface / protocol
- return iterators that always return the same iterator (i.e. [not fresh iterators][])
- return [closeable iterators][]
- lazily consume to provided iterable

However, if you're writing a sink function, e.g. `toArray` or `toPromise`,
your function should probably:

- be `async` (or at least return a `Promise`).
- eagerly consume the provided iterable

[the `icw.js` file]: https://github.com/icwjs/icw/blob/master/src/ICW.ts
[not fresh iterators]: http://exploringjs.com/es6/ch_iteration.html#_iterables-that-return-fresh-iterators-versus-those-that-always-return-the-same-iterator
[closeable iterators]: http://exploringjs.com/es6/ch_iteration.html#_closable-iterators

### Tests

#### Running the Test Suite

To run the test suite, use:

```sh
npm test
```

`icw` uses `jest`, so please see [the `jest` documentation][jest docs] for a
list of available CLI options.

[jest docs]: https://jestjs.io/docs/en/cli.html

#### Writing Tests

Because the `ICW` class is more or less a thin wrapper around the standalone
functions, the tests are structured somewhat unusually compared to other
projects.

In order to share tests between standalone functions and ICW methods, most of
the tests are written inside files that export a testing suite factory, which
is called in the file that actually runs the test. These suites are located
in the `test/suites` folder.

If you are writing a new function, you should generally:

- create a suite in `test/suites` that exports a function that accepts your
  method as an argument. For example, if your new function is called
  `myAwesomeFunction.ts`, you should create a file called
  `test/suites/runMyAwesomeFunctionSuite.js`

- create a file in at the root of `test` with the same base name as your
  standalone function, i.e. if your function is defined in
  `myAwesomeFunction.ts`, the test should be called
  `myAwesomeFunction.spec.js`

- add your function to the test suite in `test/ICW.spec.js`

- test your function using async iterables instead of sync ones. For example,
  try to use `of(1, 2, 3)` instead of `[1, 2, 3]` whenever possible.

If your function returns an iterable, you should:

- test that it is closeable
- test that it lazily consumes its input

If you are writing a sink function (e.g. <code>toArray</code>), you should:

- test that your function eagerly consumes its input.

If your function accepts a callback, you should:

- test that the callback is called with the correct number of arguments
- test that it is called with the appropriate `this` context (if your
  function has a `thisArg` param)
- have a separate test for each argument that will be passed to the callback.
  That is, instead of something like

  ```javascript
  test("calls callback with expected arguments", () => {});
  ```

  You should write something like:

  ```javascript
  test("calls callback with three arguments", () => {});
  test("provides value as first argument to callback", () => {});
  test("provides index as second argument to callback", () => {});
  test("provides thisArg as third argument to callback", () => {});
  ```

#### Linting Tests

The tests are linted using [`eslint-plugin-jest`][], but here are some
general guidelines:

- do not use any hooks, e.g. `beforeEach` or `afterEach`
- use `test` instead of `it`
- test descriptions should be worded along the lines of "does awesome thing"
  instead of "should do awesome thing"

[`eslint-plugin-jest`]: https://www.npmjs.com/package/eslint-plugin-jest

### Style

The code in `icw` doesn't follow Airbnb, StandardJS, or any other major style
guide, and it probably never will.

That being said, most of the nitpicky stylistic stuff is automatically
handled by ESLint and `prettier`. This section here is to point out some of
the unlintable guidelines, or to explain why some of the less common rules
are the way the are.

#### Guidelines

<details>
  <summary>No default exports</summary>
Default exports are cool, but they're also one of the major pain points of
writing a library that has a consistent interface for both ES Modules and
CommonJS.

The primary reason for banning default exports is that Node.js still uses
CommonJS by default. I personally don't like having to access default exports
using something like

```javascript
const foo = require("foo").default;
```

</details>

<details>
<summary>Sort imports alphabetically within groups</summary>

This just makes it easier to find imports.

It would be great to handle this automatically. <code>icw</code> already uses
the excellent <a
href="https://www.npmjs.com/package/eslint-plugin-import"><code>eslint-pluign-import</code></a>
to handle most <code>import</code>-related sorting.

Unfortunately, <code>eslint-plugin-import</code> currently <a
href="https://github.com/benmosher/eslint-plugin-import/issues/389">does not
support sorting imports within groups</a>, and its <code>import/order</code>
rule doesn't play well with ESLint's own <code>sort-order</code> rule.

</details>

<details>
<summary>Prefer <code>let</code> over <code>const</code></summary>

Most ES6+ style guides have rules that go something like:

<ul>
  <li>use <code>const</code> by default
  <li>if you need to modify a primitive, use <code>let</code>
  <li>never use <code>var</code>
</ul>

However, the rules for <code>icw</code> are:

<ul>
  <li>use <code>let</code> by default
  <li>only use <code>const</code> for CommonJS imports and SHOUTY_CASE top-level primitives
  <li>never use <code>var</code>
</ul>

Don't knock it till you try it!

For longer (and better) thoughts on this topic, please see the following
articles:

<ul>
  <li><a href="https://jamie.build/const">A fucking rant about fucking <code>const</code> vs fucking <code>let</code></a> by Jamie Kyle
  <li><a href="https://madhatted.com/2016/1/25/let-it-be">Let It Be - How to declare JavaScript variables</a> by Matthew Beale
  <li><a href="https://web.archive.org/web/20160315114714/http://blog.getify.com/constantly-confusing-const/">Constantly confusing <code>const</code></a> by Kyle Simpson
</ul>

</details>

<details>
<summary>Prefer <code>function</code>-keyword declarations, and make liberal use of function hoisting</summary>

Arrow functions are awesome, but please avoid using them except in tests
and inline callbacks.

There are a couple reasons for this:

<ul>
  <li>There is (currently) no syntax for arrow generator functions, so it's more
    consistent if all of our exports just use the full `function` keyword
  <li> Function hoisting is awesome, and arrow functions don't allow it
</ul>

In general, try to keep your main, exported function near the top of the file
and put any helper functions underneath it.

</details>

## Security

If you have found a security vulnerability in `icw`, please email me at
bdchauvette@gmail.com with "ICW Security" somewhere in the subject.

Security issues will always receive the highest priority for fixing.

---

On behalf of all the users and contributors of `icw`, thanks again for
taking the time to read this, and thank you so much for your contribution!
