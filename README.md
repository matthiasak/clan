# Clan

Clan is a super succinct, no-dependency set of utilities with a slightly opinionated collection of features that integrate particularly well when used together. 

---

[![NPM](https://nodei.co/npm/@clan.png)](https://nodei.co/npm/@clan/)
![](https://david-dm.org/matthiasak/clan.svg)
[![Build Status](https://travis-ci.org/matthiasak/clan.svg?branch=master)](https://travis-ci.org/matthiasak/clan)

## Usage

```sh
yarn add @clan
# or
npm install --save @clan
```

## Caught a bug?

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Install the dependencies: `yarn`
3. Bundle the source code and watch for changes: `npm start`

After that, you'll find the code in the `./build` folder!

## features

1. [fp.js](src/fp.js) - functional composition and transducers
2. [hamt.js](src/hamt.js) - persistent, immutable data structure library enabled by a pure JS Hash Array Mapped Trie
3. [model.js](src/model.js) - a rules-based and constructor/type-based engine that validates deeply-nested data structures; basically, an ORM that validates POJOs
4. [mixin.js](src/mixin.js) - a `mixin()` function that can build mixins for an ES6 `class`
5. [batch.js](src/batch.js) - a functional abstraction for a `fetch()` that deduplicates on-the-wire requests, batching parallel requests together
6. [vdom.js](src/vdom.js) - a tiny, super-fast universal Virtual DOM with functional wrappers that can load data from sync or async sources before rendering completes
7. [observable](src/observable.js) - an extremely powerful, efficient, memory-friendly state cascading paradigm that enables all sorts of asynchronous, functional, and lazy-evaluation paradigms

## Examples

<details>
<summary>fp.js</summary>

```js
// import it
import {log, rAF, c, cof, cob, pf, curry, mapping, filtering, concatter} from '@clan'
```

```js
// example point-free usage: 
const replace = pf(String.prototype.replace)
const toLowerCase = pf(String.prototype.toLowerCase)
const normalizeName = cof(replace(/\s+/ig, '_'), toLowerCase())
log(normalizeName('Matt K'))
```

```js 
// example transducer usage:
const inc = x => x+1
const greaterThanTwo = x => x>2
const concat = (arr, v) => arr.concat([v])
const incGreaterThanTwo = cof(
    mapping(inc),
    filtering(greaterThanTwo)
)
reduce([1,2,3,4], incGreaterThanTwo(concat), []) // => [3,4,5]

```
</details>

<details>
<summary>hamt.js</summary>

```js
// import it
import {hamt} from '@clan'
```

```js
// get and set properties, returns a new hmap

let   x = hamt({'hello': 1})
    , x1 = x.set('goodbye', 2) // new object with all x's properties plus a new property
    , x2 = hamt( Array(50).fill(true).map((x,i) => i) ) // we can mode lists/arrays, too 
    , x3 = x1.unset('goodbye')

log(
    x.get('hello'),    // 1
    x1.get('goodbye'), // 2
    x3.get('goodbye'), // undefined
    x3.get('hello'),   // 1
    x.comp(x,x3),      // true (compares hashes)
    x === x3,          // false
)

// map into a new hamt
const nums = hamt([1,2,3]).map(x => x+1) // mapped into new hamt 
// reduce into one value
nums.reduce((acc,x,i) => acc+x, 0) // 9
// get JSON value
nums.toJSON()
```
</details>

<details>
<summary>observable.js</summary>

```js
// import it
import {obs} from '@clan'
```

```js
// Usage:
const x = obs()

    , y = x
        .map(x => x + 1)
        .filter(x => x % 5 === 0)
    
    , y1 = y
        .then(log)

    , y2 = y
        .takeWhile(x => x <= 10)
        .then(log)

    , z = y
        .take(3)
        .then(log)

const run = (n,o) => 
    Array(n).fill(1)
    .map((_,i) => o(i))
    
run(150,x)
```

```js
// push to observable from any event, debounce them, reduce values, 
// logically split the observable path with a .then() node
obs.from(push => 
    window.addEventListener(
        'mousemove',
        ({clientX:x,clientY:y}) => push({x, y})
    ))
    .debounce(200)
    .then(x => {
        document.body.innerHTML = `{${x.x},${x.y}}`
    })
    .reduce((acc,x) => acc+1, 0)
    .then(x => reset() || log(x))
```

```js
// push to observable from setInterval,
// demo how to have multiple observable sources 
// logically combine and pipe into a single observable destination,
// also show how to halt an observable
const interval = ms =>
    obs.from(push => 
        setInterval(() => push(1), ms))

const u = obs
    .union(interval(2500),interval(1000),interval(3000)) // union() takes infinite params

u
    .reduce((acc,x) => acc+1, 0) // count the number of updates
    .then(log) // log the count
    .then(() => setTimeout(u.stop.bind(u), 10000)) // after 10s, stop the observable
```

```js
// combine observables and HAMT's is the best of both worlds
// you can declaratively describe what happens, and HAMT-creation
// costs very little
const time = obs.from(p => setInterval(() => p(new Date), 1000))

time
    .reduce((acc, x) => acc.set(x, true), hamt())
    .then(m => reset() || log(m.toJSON()))
```

```js
// embed network requests into observable chains
const getUser = user => 
    fetch(`https://api.github.com/users/${user}`)
        .then(r => r.json())
    , x = obs()
    , [done,err] = x.maybe(getUser)

const success = done
    .then(e => log(e))
    .map(data => data.avatar_url)
    .then(log)

err
    .then(e => log(e))

x('matthiasak')
```

```js
// SPA's - you can roll your own router
const app = 
    obs
    .from(p => window.addEventListener('hashchange', p))
    .map(x => window.location.hash)

const routes = {
    a: () => log('a'),
    b: () => log('b')
}

const onhash =
    app
    .map(route => routes[ route.substr(1) ])
    .then(v => v())

app('#a')
```
</details>

## Authors

- Matthew Keas, [@matthiasak](https://twitter.com/@matthiasak). Need help / support? Create an issue or ping on Twitter.
