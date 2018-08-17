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

#### `pre-push`

Before pushing, the test suite will be run against any files that have
changed from the `master` branch. This is used to prevent Travis builds from
running when there are errors that can be caught locally.

[`husky`]: https://github.com/typicode/husky
[`commitlint`]: https://github.com/marionebl/commitlint
[`@commitlint/config-conventional`]: https://github.com/marionebl/commitlint/tree/master/%40commitlint/config-conventional
[`lint-staged`]: https://github.com/okonet/lint-staged

## Documentation

Good documentation is the unsung hero of open source software, and writing
good, clear documentation is an underappreciated art. From the bottom of my
heart, thank you so much for helping to improve the docs, and make it easier
for everyone else to learn how to use `icw` :heart:

If your PR is exclusively about documentation, feel free to open it without
first filing an issue. I think that if the documentation is wrong,
inadequate, or confusing enough to make you want to open a PR, then we should
fast track it and try to get it merged as quickly as possible. Discussions
and workshopping the copy can be done in the PR itself.

However, if you do find the docs wrong or confusing, but do not feel
comfortable opening a PR to fix it, I definitely encourage you to open an
issue pointing out what needs to be fixed, and we'll do our best to get it
fixed.

The only firm rule for documentation is that it should follow standard
American English spelling. This isn't because American English is better than
any other variety, it's just that I happen to be American, and I would like
the docs to be as consistent as possible throughout.

**You do not need to be fluent in English to help contribute to the
documentation.** Indeed, I think that coming at the docs with a different
perspective can really help point out parts that are confusing for non-fluent
speakers, allowing us to make them make them better for everyone.

Please note that I personally consider the PR process to be akin to
workshopping a piece of literature. If changes are requested, it's not from a
place of hostility or adversity, but from a desire to make `icw` the best
library it can be.

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

I won't reject PRs that don't have issues, but it will save us all some time
if we can discuss the feature and its proposed implementation before you
write any code.

That being said, the process that I generally use when adding a new (function|method|combinator|operator|_whatever_) is:

1. Create a new file for your function at the root level of the `src` folder,
   e.g. `src/myNewFunction.ts`

1. Use a _named_ export to export your function from the file ([see style section](#style))

1. Add a new method to the class in [the `ICW.js` file][] that imports and wraps the
   standalone function from step 1

1. Write tests ([see next section](#tests))

In general, new iterable functions should:

- return something that implements the `AsyncIterableIterator` interface / protocol
- return iterators that always return the same iterator (i.e. [not fresh iterators][])
- return [closeable iterators][]

However, if you're writing a sink-style function, e.g. `toArray` or
`toPromise`, your function should probably just be `async` (or at least
return a `Promise`).

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
functions, the tests are structured somewhat unusually.

The bulk of the tests are written inside files that export a testing suite
and can be used to test both the standalone functions and ICW methods that
wrap them. These suites are located in the `test/suites` folder.

If you are writing a new function, you should generally:

1. create a suite in `test/suites` that exports a function that accepts your
   method as an argument. For example, if your new function is called
   `myAwesomeFunction.ts`, you should create a file called
   `test/suites/runMyAwesomeFunctionSuite.js`

2. create a file in at the root of `test` with the same base name as your
   standalone function, i.e. if your function is defined in
   `myAwesomeFunction.ts`, the test should be called
   `myAwesomeFunction.spec.js`

3. add your function to the test suite in `test/ICW.spec.js`

Your tests should test for consuming input from both synchronous (i.e.
`Symbol.iterator`) and asynchronous (i.e. `Symbol.asyncIterator`) iterables.
If your new function returns an iterable, you should test that:

- it consumes its input lazily
- it is closeable

If your new function operates on iterables does not return them (e.g.
`toArray`), you should test that it consumes its input either eagerly or
lazily, whichever is appropriate.

If your function accepts a callback, you should have separate tests for each
argument that will be passed to the callback. That is, instead of something like

```javascript
test("calls callback with expected arguments", () => {});
```

You should have something like:

```javascript
test("provides iterable as first argument to callback", () => {});
test("provides index as second argument to callback", () => {});
test("provides thisArg as second argument to callback", () => {});
```

The tests are linted using [`eslint-plugin-jest`][], but here are some
general guidelines:

- do not use any hooks, e.g. `beforeEach` or `afterEach`
- use `test` instead of `it`
- test descriptions should be worded along the lines of "does awesome thing"
  instead of "should do awesome thing"

[`eslint-plugin-jest`]: https://www.npmjs.com/package/eslint-plugin-jest

### Style

The code in `icw` is somewhat idiosyncratic. It doesn't follow Airbnb or any
other major style guide, and I have no intention of ever doing so. There's
nothing wrong with those other style guides. It's just that I (very selfishly)
view `icw` is a chance to write code how _I_ want to write code.

Most of the nitpicky stylistic stuff is automatically handled by ESLint and
`prettier`. This section here is to point out some of the unlintable
preferences I have, or to explain reasons for why some of the stylistic
choices are the way they are.

#### No default exports

Default exports are cool, but they're also one of the major pain points of
writing a library that has a consistent interface for both ES Modules and
CommonJS.

The primary reason for banning default exports is that Node.js still uses
CommonJS by default. I personally don't like having to access default exports
using something like

```javascript
const foo = require("foo").default;
```

#### Sort imports alphabetically within groups

Please try to sort your imports alphabetically by filename

(It would be great to handle this automatically. `icw` already uses the
excellent [`eslint-pluign-import`][] to handle most `import`-related sorting,
but it currently [doesn't have a way to sort imports within
groups][import/order], and it doesn't play well with ESLint's own
`sort-order` rule :crying_cat_face:)

[`eslint-plugin-import`]: https://www.npmjs.com/package/eslint-plugin-import
[import/order]: https://github.com/benmosher/eslint-plugin-import/issues/389

#### Prefer `let` over `const`

Most ES6+ style guides have rules that go something like:

- use `const` by default
- if you need to modify a primitive, use `let`
- never use `var`

The rules for `icw`, however, are:

- use `let` by default
- only use `const` for CommonJS imports and SHOUTY_CASE top-level primitives
- never use `var`

I know, I know, this probably seems crazy. And this is probably the most
eccentric stylistic part of the repo.

I've got nothing against `const`, per se. I, too, use `prefer-const` at work.
But I get annoyed whenever ESLint "autofixes" a `let`, and I feel kind of dirty
whenever I `push` a value into a `const` array, or change a property on a const
object. Yes, `const` is only about constant _binding_, but still. "`const`
all the things!" has started to bug me, and this is my chance to let my `let`
flag fly.

If you're in the habit of using `const` by default, and get annoyed by the
lack of autofixing for `prefer-let`, take a look at [pull request #2][] over at
[`eslint-plugin-prefer-let`][].

For longer (and better) thoughts on this topic, I heartily recommend reading
the following:

- [A fucking rant about fucking `const` vs fucking `let`][2018-03-20 kyle] by Jamie Kyle
- [Let It Be - How to declare JavaScript variables][2016-01-05 beale] by Matthew Beale
- [Constantly confusing `const`][2015-09-08 simpson] by Kyle Simpson

[pull request #2]: https://github.com/cowboyd/eslint-plugin-prefer-let/pull/6
[`eslint-plugin-prefer-let`]: https://github.com/cowboyd/eslint-plugin-prefer-let
[2015-09-08 simpson]: https://web.archive.org/web/20160315114714/http://blog.getify.com/constantly-confusing-const/
[2016-01-05 beale]: https://madhatted.com/2016/1/25/let-it-be
[2018-03-20 kyle]: https://jamie.build/const

#### Prefer `function` declarations, and make liberal use of function hoisting

Arrow functions are _awesome_, but please avoid using them except in tests
and callbacks.

There are a couple reasons for this:

- There is (currently) no syntax for arrow generator functions, so it's more
  consistent if all of our exports just use the full `function` keyword

- I love &ndash; _love_ &ndash; function hoisting, and arrow functions don't
  let me do that

In general, try to keep your main, exported function near the top of the file
and put any helper functions underneath it.

## Security

If you have found a security vulnerability in `icw`, please email me at
bdchauvette@gmail.com with "ICW Security" somewhere in the subject.

Security issues will always receive the highest priority for fixing.

---

Whew!

On behalf of myself and all users and contributors of `icw`, thanks again for
taking the time to read this, and thank you so much for your contribution!

<p align="right">
&horbar; Ben Chauvette :heart:
</p>
