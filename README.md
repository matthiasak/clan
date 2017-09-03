# Clan

Clan is a super succinct, no-dependency set of utilities with a slightly opinionated collection of features that integrate particularly well when used together. As of v1.0.0, it is now written in TypeScript and bundled with FuseBox.

---

[![NPM](https://nodei.co/npm/clan-fp.png)](https://nodei.co/npm/clan-fp/)
[![Build Status](https://travis-ci.org/matthiasak/clan.svg?branch=master)](https://travis-ci.org/matthiasak/clan)

## Usage

```sh
yarn add clan-fp
# or
npm install --save clan-fp
```

Check out the tests in the src folder for examples of code.

## Run tests

```sh
npm run test
```

## Caught a bug?

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Install the dependencies: `yarn`
3. Bundle the source code and watch for changes: `npm start`

After that, you'll find the code in the `./build` folder!

## features

1. [fp.ts](src/fp.ts) - functional composition and transducers
2. [model.ts](src/model.ts) - a rules-based and constructor/type-based engine that validates deeply-nested data structures; basically, an ORM that validates POJOs for attack vectors on a server (i.e. parse your incoming networked data sources).
3. [batch.ts](src/batch.ts) - a functional abstraction for a `fetch()` that deduplicates on-the-wire requests, batching parallel requests together
4. [observable.ts](src/observable.ts) - an extremely powerful, efficient, memory-friendly state cascading paradigm that enables all sorts of asynchronous, functional, and lazy-evaluation paradigms
5. [worker.ts](src/worker.ts) - a quick, observable-friendly abstraction to creating web worker threads via blobs/blob URLs, pushing dependency code to them, and even spreading work to multiple workers in parallel and streaming the output back to one method. Works very nicely with observables as both input and output pipes.
6. [prop.ts](src/worker.ts) - a tiny implementation that acts like Underscore's `_.get(object, path)`; grab nested properties with a "CSS selector" from an object tree; returns that value or null if not found.
7. [server.ts](src/server.ts) - an observable-based, lightweight and cache-friendly streaming server.

## Authors

- Matthew Keas, [@matthiasak](https://twitter.com/@matthiasak). Need help / support? Create an issue or ping on Twitter.
