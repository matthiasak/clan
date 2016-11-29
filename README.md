# Clan

[arbiter]: https://matthiasak.github.io/arbiter-frame/

Clan is a super succinct, no-dependency set of utilities with a slightly opinionated collection of features that integrate particularly well when used together.

---

[![NPM](https://nodei.co/npm/clan-fp.png)](https://nodei.co/npm/clan-fp/)
![](https://david-dm.org/matthiasak/clan.svg)
[![Build Status](https://travis-ci.org/matthiasak/clan.svg?branch=master)](https://travis-ci.org/matthiasak/clan)

## Usage

```sh
yarn add clan-fp
# or
npm install --save clan-fp
```

## Try It Out!

You can copy+paste the following into [Arbiter], or you can click the following to load the pre-made page: [Arbiter example with clan-fp](https://goo.gl/iBQAop)

```js
const app = () => {
    const {vdom, model, hamt, obs, mixin, c, cob, cof, concatter, curry, mapping, filtering, pf} =
          clanFp


}

require('clan-fp').then(app)
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
7. [observable.js](src/observable.js) - an extremely powerful, efficient, memory-friendly state cascading paradigm that enables all sorts of asynchronous, functional, and lazy-evaluation paradigms
8. [worker.js](src/worker.js) - a quick, observable friendly abstraction to creating web worker threads via blobs/blob URLs, pushing dependency code to them, and even spreading work to multiple workers in parallel and streaming the output back to one method. Works very nicely with observables as both input and output pipes.

## Examples

<details>
<summary>fp.js</summary>

```js
// import it
import {log, rAF, c, cof, cob, pf, curry, mapping, filtering, concatter} from 'clan-fp'
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
import {hamt} from 'clan-fp'
```

```js
// get and set properties, returns a new hmap

let   x = hamt.hamt({'hello': 1})
    , x1 = hamt.set(x, 'goodbye', 2) // new object with all x's properties plus a new property
    , x2 = hamt.hamt( Array(50).fill(true).map((x,i) => i) ) // we can mode lists/arrays, too
    , x3 = hamt.unset(x1, 'goodbye')

log(
    hamt.get(x'hello'),     // 1
    hamt.get(x1, 'goodbye'),// 2
    hamt.get(x3, 'goodbye'),// undefined
    hamt.get(x3, 'hello'),  // 1
    hamt.comp(x,x3),        // true (compares hashes)
    x === x3,               // false
)

// map into a new hamt
const nums = hamt([1,2,3]).map(x => x+1) // mapped into new hamt
// reduce into one value
hamt.reduce((acc,x,i) => acc+x, 0) // 9
// get JSON value
hamt.toJSON(nums)
```
</details>

<details>
<summary>observable.js</summary>

```js
// import it
import {obs} from 'clan-fp'
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
    .then(m => reset() || log(hamt.toJSON(m)))
```

```js
// HAMT's again with observables
const flames = obs()

const addFlame = (n=1) =>
    Math.random() < n
    ? flames(hamt.push(flames(), flame()))
    : flames(flames())

const log = (...a) => console.log(...a)

flames
    .map(ps =>
        // map the ps hamt into a new hamt
        hamt.map(
            hamt.filter(ps, ({position:p, size:s}) => p[1] > -1*s && s>1),
            p => {
                let x = updateParticle(
                    applyForce(p, p.size*.016, [random(-2,2),-1]),
                    WORLD_FRICTION
                )
                p.size *= .99
                return p
            }))
    .then(ps =>
        rAF($ => addFlame(.3)))
    .then(ps => rAF(() => {
        // log(ps)
        ctx.clearRect(0,0,canvas.width,canvas.height)
        hamt.map(ps, ({position, size}) => {
            const [x,y] = position
            ctx.fillStyle = '#'+removeGreen(color(size))
            ctx.beginPath()
            ctx.arc(x, y, size/2, 0, 2*Math.PI)
            ctx.fill()
            ctx.closePath()
        })
    }))

flames(hamt.hamt())
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
<details>
<summary>worker.js</summary>

```js
// single worker
// create preqrequisite methods for a worker
const fact = n => n < 2 ? 1 : n * fact(n-1)
const compute = (e) => {
    const {data:{type, data}} = e
    switch(type){
        case "factorial": postMessage(fact(data))
    }
}
// provide fact as a prereq, then compute as the handler
const w = worker(fact, compute)

handle messaging to the first worker "w"
w.onmessage = function(e) {
    log('Response: ' + e.data)
}

Array(4000).fill(1).map((x,i) => w.postMessage({type: "factorial", data: i}))
```

```js
// worker farm
const fact2 = n => n < 2 ? 1 : n * fact2(n-1)
const compute2 = (e) => {
    const x = e.data[0]
    postMessage(fact2(x))
}

let count = 0
let times = 40000
var t0 = +new Date
const time = v => {
    if(++count === times)
        log(+new Date - t0 + 'ms') // show total time to compute
}
const s = farm(4, fact2, compute2).pipe(time).error(log)
Array(times).fill(1).map((x,i) => s(400))
```
</details>

## Authors

- Matthew Keas, [@matthiasak](https://twitter.com/@matthiasak). Need help / support? Create an issue or ping on Twitter.
