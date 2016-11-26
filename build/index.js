exports["clan"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_batch__ = __webpack_require__("./src/batch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_vdom__ = __webpack_require__("./src/vdom.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_mixin__ = __webpack_require__("./src/mixin.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__src_model__ = __webpack_require__("./src/model.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__src_observable__ = __webpack_require__("./src/observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__src_hamt__ = __webpack_require__("./src/hamt.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__src_fp__ = __webpack_require__("./src/fp.js");
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "log", (function() { return __WEBPACK_IMPORTED_MODULE_6__src_fp__["a"]; }));
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "rAF", (function() { return __WEBPACK_IMPORTED_MODULE_6__src_fp__["b"]; }));
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "c", (function() { return __WEBPACK_IMPORTED_MODULE_6__src_fp__["c"]; }));
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "cof", (function() { return __WEBPACK_IMPORTED_MODULE_6__src_fp__["d"]; }));
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "cob", (function() { return __WEBPACK_IMPORTED_MODULE_6__src_fp__["e"]; }));
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "pf", (function() { return __WEBPACK_IMPORTED_MODULE_6__src_fp__["f"]; }));
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "curry", (function() { return __WEBPACK_IMPORTED_MODULE_6__src_fp__["g"]; }));
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "mapping", (function() { return __WEBPACK_IMPORTED_MODULE_6__src_fp__["h"]; }));
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "filtering", (function() { return __WEBPACK_IMPORTED_MODULE_6__src_fp__["i"]; }));
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "concatter", (function() { return __WEBPACK_IMPORTED_MODULE_6__src_fp__["j"]; }));
/* harmony reexport (binding) */ __webpack_require__.d(exports, "batch", (function() { return __WEBPACK_IMPORTED_MODULE_0__src_batch__["a"]; }));
/* harmony reexport (binding) */ __webpack_require__.d(exports, "vdom", (function() { return __WEBPACK_IMPORTED_MODULE_1__src_vdom__["a"]; }));
/* harmony reexport (binding) */ __webpack_require__.d(exports, "mixin", (function() { return __WEBPACK_IMPORTED_MODULE_2__src_mixin__["a"]; }));
/* harmony reexport (binding) */ __webpack_require__.d(exports, "model", (function() { return __WEBPACK_IMPORTED_MODULE_3__src_model__["a"]; }));
/* harmony reexport (binding) */ __webpack_require__.d(exports, "obs", (function() { return __WEBPACK_IMPORTED_MODULE_4__src_observable__["a"]; }));
/* harmony reexport (module object) */ __webpack_require__.d(exports, "hamt", (function() { return __WEBPACK_IMPORTED_MODULE_5__src_hamt__; }));


/***/ },

/***/ "./node_modules/process/browser.js":
/***/ function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ },

/***/ "./src/batch.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};// batched requests
// The `fetch()` module batches in-flight requests, so if at any point in time, anywhere in my front-end or
// back-end application I have a calls occur to `fetch('http://api.github.com/users/matthiasak')` while another
// to that URL is "in-flight", the Promise returned by both of those calls will be resolved by a single network request.
// f :: (url -> options) -> Promise
const batch=f=>{let inflight={};return(url,options={})=>{let{method}=options,key=`${url}:${JSON.stringify(options)}`;if((method||'').toLowerCase()==='post')return f(url,_extends({},options,{compress:false}));return inflight[key]||(inflight[key]=new Promise((res,rej)=>{f(url,_extends({},options,{compress:false})).then(d=>{return res(d);}).catch(e=>{return rej(e);});}).then(data=>{inflight=_extends({},inflight,{[key]:undefined});return data;}).catch(e=>{return console.error(e,url);}));};};/* harmony default export */ exports["a"] = batch;

/***/ },

/***/ "./src/fp.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {const log=(...a)=>{return console.log(...a);};
/* harmony export (immutable) */ exports["a"] = log;
// rAF
const rAF=document&&(requestAnimationFrame||webkitRequestAnimationFrame||mozRequestAnimationFrame)||process&&process.nextTick||(cb=>{return setTimeout(cb,16.6);});
/* harmony export (immutable) */ exports["b"] = rAF;
// composition
// c :: (T -> U) -> (U -> V) -> (T -> V)
const c=(f,g)=>{return x=>{return f(g(x));};};
/* harmony export (immutable) */ exports["c"] = c;
// cof :: [(an -> bn)] -> a0 -> bn
// compose forward
const cof=(...fns)=>{return fns.reduce((acc,fn)=>{return c(acc,fn);});};
/* harmony export (immutable) */ exports["d"] = cof;
// cob :: [(an -> bn)] -> b0 -> an
// compose backwards
const cob=(...fns)=>{return cof(...fns.reverse());};
/* harmony export (immutable) */ exports["e"] = cob;
// functional utilities
// pointfree
const pf=fn=>{return(...args)=>{return x=>{return fn.apply(x,args);};};};
/* harmony export (immutable) */ exports["f"] = pf;
// curry
// curry :: (T -> U) -> [args] -> ( -> U)
const curry=(fn,...args)=>{return fn.bind(undefined,...args);};
/* harmony export (immutable) */ exports["g"] = curry;
// Transducers
const mapping=mapper=>{return(// mapper: x -> y
reducer=>{return(// reducer: (state, value) -> new state
(result,value)=>{return reducer(result,mapper(value));});});};
/* harmony export (immutable) */ exports["h"] = mapping;
const filtering=predicate=>{return(// predicate: x -> true/false
reducer=>{return(// reducer: (state, value) -> new state
(result,value)=>{return predicate(value)?reducer(result,value):result;});});};
/* harmony export (immutable) */ exports["i"] = filtering;
const concatter=(thing,value)=>{return thing.concat([value]);};
/* harmony export (immutable) */ exports["j"] = concatter;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ },

/***/ "./src/hamt.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
// compute the hamming weight
const hamming=x=>{x-=x>>1&0x55555555;x=(x&0x33333333)+(x>>2&0x33333333);x=x+(x>>4)&0x0f0f0f0f;x+=x>>8;x+=x>>16;return x&0x7f;};
/* harmony export (immutable) */ exports["hamming"] = hamming;
const popcount=root=>{if(root.key)return 1;let c=root.children;if(c){var sum=0;for(var i in c)sum+=popcount(c[i]);return sum;}};
/* harmony export (immutable) */ exports["popcount"] = popcount;
// hash fn
const hash=(v='')=>{v=JSON.stringify(v);var hash=5381;for(let i=0;i<v.length;i++)hash=(hash<<5)+hash+v.charCodeAt(i);return hash;};
/* harmony export (immutable) */ exports["hash"] = hash;
// compare two hashes
const comp=(a,b)=>{return hash(a)===hash(b);};
/* harmony export (immutable) */ exports["comp"] = comp;
// get a bit vector
const HMAP_SIZE=8;
/* harmony export (immutable) */ exports["HMAP_SIZE"] = HMAP_SIZE;
const MAX_DEPTH=32/HMAP_SIZE-1;
/* harmony export (immutable) */ exports["MAX_DEPTH"] = MAX_DEPTH;
const vec=(h=0,i=0,range=HMAP_SIZE)=>{return h>>>range*i&(1<<range)-1;};
/* harmony export (immutable) */ exports["vec"] = vec;
const shallowClone=x=>{let y=Object.create(null);for(let i in x)y[i]=x[i];return y;};
/* harmony export (immutable) */ exports["shallowClone"] = shallowClone;
const cloneNode=x=>{let y=node();if(!x)return y;if(x.children){y.children=shallowClone(x.children);}else if(x.key!==undefined){y.key=x.key;y.val=x.val;y.hash=x.hash;}return y;};
/* harmony export (immutable) */ exports["cloneNode"] = cloneNode;
const numChildren=x=>{let c=0;for(var i in x)++c;return c;};
/* harmony export (immutable) */ exports["numChildren"] = numChildren;
const set=(root,key,val)=>{if(root.key===undefined&&!root.children)return node(key,val);const newroot=cloneNode(root),h=hash(key);// walk the tree
for(var i=3,r=root,n=newroot;i>=0;--i){let bits=vec(h,i);if(r.key!==undefined){// if we have a collision
if(r.key===key||i===0){// if keys match or is leaf, just overwrite n's val
n.val=val;}else if(i!==0){// else if r is not at max depth and keys don't match
// add levels to both trees, new tree must be able
// to access old data
// 0. create makeshift value node for r
// and new value node for n
let cp=node(r.key,r.val,r.hash);let cn=node(key,val,h);let rh=r.hash;// 1. delete value props from nodes
delete r.key;delete r.val;delete r.hash;delete n.key;delete n.val;delete n.hash;// 2. create layers until bit-vectors don't collide
for(let j=i,__r=r,__n=n;j>=0;j--){let vecr=vec(rh,j),vecn=vec(h,j);// create new layer for c and r
let c=__r.children=Object.create(null);let d=__n.children=shallowClone(c);if(vecr!==vecn){c[vecr]=cp;d[vecr]=cp;d[vecn]=cn;break;}else{__r=c[vecr]=node();__n=d[vecn]=cloneNode(__r);}}}break;}else if(r.children){let _r=r.children[bits];if(!_r){n=n.children[bits]=node(key,val);break;}else{r=_r;n=n.children[bits]=cloneNode(r);}}}return newroot;};
/* harmony export (immutable) */ exports["set"] = set;
const get=(root,key)=>{if(root.key===key)return root.val;const h=hash(key);for(let i=3,r=root;i>=0;--i){if(!r.children)return undefined;r=r.children[vec(h,i)];if(!r)return undefined;if(r.key!==undefined)return r.val;}return undefined;};
/* harmony export (immutable) */ exports["get"] = get;
const first=root=>{let c=root.children;for(let i in c)return c[i];};
/* harmony export (immutable) */ exports["first"] = first;
const unset=(root,key)=>{const n=cloneNode(root),h=hash(key);for(var i=3,_n=n,p=n;i>=-1;--i){if(_n.key){delete _n.key;delete _n.val;delete _n.hash;return n;//             let c = numChildren(p)
//             if(c === 1) {
//                 // if only child, delete child and parent?
//                 delete p.children
//             } else if(c===2){
//                 // if 2 children, promote sibling as parent value nod
//                 delete p.children[bits]
//                 let sibling = first(p)
//                 delete p.children
//                 if(sibling.children){
//                     p.children = sibling.children
//                 } else if(p.key) {
//                     p.val = sibling.val
//                     p.hash = sibling.hash
//                     p.key = sibling.key
//                 }
//             } else {
//                 // if more than 2 children, just delete the one
//                 delete p.children[bits]
//             }
//             return n
}const bits=vec(h,i);_n=_n&&_n.children&&_n.children[bits];if(!_n)return n;p=_n;}return n;};
/* harmony export (immutable) */ exports["unset"] = unset;
const node=(key,val,h=key!==undefined&&hash(key))=>{/*
    potential props of a tree node
    - key - hashkey
    - val - value
    - children - { ... } -> points to other nodes (List<Node> children)
    */let item=Object.create(null);if(key!==undefined){item.key=key;item.hash=h;item.val=val;}return item;};
/* harmony export (immutable) */ exports["node"] = node;
const map=(root,fn)=>{if(root.key!==undefined)return node(root.key,fn(root.val,root.key),root.hash);let d=cloneNode(root),c=d.children;if(c){for(var i in c){c[i]=map(c[i],fn);}}return d;};
/* harmony export (immutable) */ exports["map"] = map;
const filter=(root,fn)=>{if(root.key!==undefined)return fn(root.val,root.key)?root:undefined;let d=cloneNode(root),c=d.children;if(c){for(var i in c){if(!filter(c[i],fn))delete c[i];}}return d;};
/* harmony export (immutable) */ exports["filter"] = filter;
const reduce=(root,fn,acc)=>{if(root.key!==undefined)return fn(acc,root.val,root.key);let c=root.children;if(c){for(var i in c)acc=reduce(c[i],fn,acc);return acc;}};
/* harmony export (immutable) */ exports["reduce"] = reduce;
const toList=(root,r=[])=>{if(root.key!==undefined)r.push(root.val);let c=root.children;if(c){for(var i in c){toList(c[i],r);}}return r;};
/* harmony export (immutable) */ exports["toList"] = toList;
const toOrderedList=(root,r=[])=>{let i=0,n;do{n=get(root,i++);n!==undefined&&r.push(n);}while(n);return r;};
/* harmony export (immutable) */ exports["toOrderedList"] = toOrderedList;
const toJSON=(root,r={})=>{if(root.key!==undefined)r[root.key]=root.val;let c=root.children;if(c){for(var i in c){toJson(c[i],r);}}return r;};
/* harmony export (immutable) */ exports["toJSON"] = toJSON;
const push=(root,val)=>{return set(root,popcount(root),val);};
/* harmony export (immutable) */ exports["push"] = push;
const pop=root=>{return unset(root,popcount(root)-1);};
/* harmony export (immutable) */ exports["pop"] = pop;
const shift=root=>{return reduce(unset(root,0),(acc,v,k)=>{return set(acc,k-1,v);},node());};
/* harmony export (immutable) */ exports["shift"] = shift;
const unshift=(root,val)=>{return set(reduce(root,(acc,v,k)=>{return set(acc,k+1,v);},node()),0,val);};
/* harmony export (immutable) */ exports["unshift"] = unshift;
const hamt=node;
/* harmony export (immutable) */ exports["hamt"] = hamt;
// console.clear()
// const l = (...args) => console.log(...args)
// const j = (...a) => console.log(JSON.stringify(a))
// let x = hamt()
// let s = 20
// Array(s).fill(1).map((v,i) => {
//     x = set(x, i, i)
// })
// l(toList(x))
// l(toJson(x))
// x = map(x, x => log(x*x) || x*x)
// l(get(x, 19))
// l(x)
// l(reduce(x, (acc, x) => acc+x, 0))
// x = unset(x, 1)
// Array(s).fill(1).map((_,i) => {
//     if(!get(x, i)) l(i)
//     // l(get(x, i))
// })

/***/ },

/***/ "./src/mixin.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
const mixin=(...classes)=>{class _mixin{}let proto=_mixin.prototype;classes.map(({prototype:p})=>{Object.getOwnPropertyNames(p).map(key=>{let oldFn=proto[key]||(()=>{});proto[key]=(...args)=>{oldFn(...args);return p[key](...args);};});});return _mixin;};/* harmony default export */ exports["a"] = mixin;

/***/ },

/***/ "./src/model.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
// Validate JS objects for their "shape"
const model={is(type,value){if(type&&type.isValid instanceof Function){return type.isValid(value);}else if(type===String&&(value instanceof String||typeof value==='string')||type===Number&&(value instanceof Number||typeof value==='number')||type===Boolean&&(value instanceof Boolean||typeof value==='boolean')||type===Function&&(value instanceof Function||typeof value==='function')||type===Object&&(value instanceof Object||typeof value==='object')||type===undefined){return true;}return false;},check(types,required,data){Object.keys(types).forEach(key=>{let t=types[key],value=data[key];if(required[key]||value!==undefined){if(!(t instanceof Array))t=[t];let i=t.reduce((a,_type)=>{return a||MODEL.is(_type,value);},false);if(!i){throw`{${key}: ${JSON.stringify(value)}} is not one of ${t.map(x=>{return`\n - ${x}`;})}`;}}});return true;},init(...args){let types,required,logic;args.map(x=>{if(x instanceof Function&&!logic){logic=x;}else if(typeof x==='object'){if(!types){types=x;}else if(!required){required=x;}}});const isValid=data=>{const pipe=logic?[check,logic]:[check];return pipe.reduce((a,v)=>{return a&&v(types||{},required||{},data);},true);};const whenValid=data=>{return new Promise((res,rej)=>{return isValid(data)&&res(data);});};return{isValid,whenValid};},ArrayOf(M){return MODEL.init((t,r,data)=>{if(!(data instanceof Array))throw`${data} not an Array`;data.map(x=>{if(!MODEL.is(M,x))throw`${x} is not a model instance`;});return true;});}};/* harmony default export */ exports["a"] = model;/**
Use it

// create a Name model with required first/last,
// but optional middle
let Name = MODEL.init({
    first: String,
    middle: String,
    last: String
}, {first:true, last:true})

// create a Tags model with extra checks
let Tags = MODEL.init((types,required,data) => {
    if(!(data instanceof Array)) throw `${data} not an Array`
    data.map(x => {
        if(!is(String, x))
            throw `[${data}] contains non-String`
    })
    return true
})

// create a Price model that just has a business logic fn
let Price = MODEL.init((t,r,d) => {
    return (d instanceof Number || typeof d === 'number') && d !== 0
})

// create an Activity model with a required type and name,
// all others optional
let Activity = MODEL.init({
    type: [String, Function, Number],
    latlng: Array,
    title: String,
    tags: Tags,
    name: Name,
    price: Price
}, {name:true, price: true})

// create a new Activity instance, throwing errors if there are
// any invalid fields.
let a = {
    tags: ['1','2'],
    type: 1,
    name: {first:'matt',last:'keas'},
    price: 100.43,
    url: 'http://www.google.com'
}
Activity.whenValid(a).then(log).catch(e => log(e+''))
**/

/***/ },

/***/ "./src/observable.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {const rAF=document&&(requestAnimationFrame||webkitRequestAnimationFrame||mozRequestAnimationFrame)||process&&process.nextTick||(cb=>{return setTimeout(cb,16.6);});// observables
const obs=state=>{const subscribers=new Set();const fn=val=>{if(val!==undefined){state=val;for(let i of subscribers)i(val);}return state;};fn.map=f=>{const o=obs();subscribers.add(val=>{return o(f(val));});return o;};fn.filter=f=>{const o=obs();subscribers.add(val=>{return f(val)&&o(val);});return o;};fn.then=f=>{subscribers.add(val=>{return f(val);});return fn;};fn.take=n=>{const values=[],o=obs();const cb=val=>{if(values.length<n)values.push(val);if(values.length===n){subscribers.delete(cb);return o(values);}};subscribers.add(cb);return o;};fn.takeWhile=f=>{const values=[],o=obs();const cb=val=>{if(!f(val)){subscribers.delete(cb);return o(values);}values.push(val);};subscribers.add(cb);return o;};fn.reduce=(f,acc)=>{const o=obs();subscribers.add(val=>{acc=f(acc,val);o(acc);});return o;};fn.maybe=f=>{const success=obs(),error=obs(),cb=val=>{return f(val).then(d=>{return success(d);}).catch(e=>{return error(e);});};subscribers.add(cb);return[success,error];};fn.stop=()=>{return subscribers.clear();};fn.debounce=ms=>{const o=obs();let ts=+new Date();subscribers.add(val=>{const now=+new Date();if(now-ts>=ms){ts=+new Date();o(val);}});return o;};return fn;};obs.from=f=>{const o=obs();f(x=>{return o(x);});return o;};obs.union=(...fs)=>{const o=obs();fs.map(f=>{return f.then(o);});return o;};/* harmony default export */ exports["a"] = obs;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ },

/***/ "./src/vdom.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {const rAF=document&&(requestAnimationFrame||webkitRequestAnimationFrame||mozRequestAnimationFrame)||process&&process.nextTick||(cb=>{return setTimeout(cb,16.6);});// Virtual DOMs
const vdom=(()=>{const class_id_regex=()=>{return /[#\.][^#\.]+/ig;},tagName_regex=()=>{return /^([^\.#]+)\b/i;};const parseSelector=s=>{let test=null,tagreg=tagName_regex().exec(s),tag=tagreg&&tagreg.slice(1)[0],reg=class_id_regex(),vdom=Object.create(null);if(tag)s=s.substr(tag.length);vdom.className='';vdom.tag=tag||'div';while((test=reg.exec(s))!==null){test=test[0];if(test[0]==='.')vdom.className=(vdom.className+' '+test.substr(1)).trim();else if(test[0]==='#')vdom.id=test.substr(1);}return vdom;};const debounce=(func,wait,immediate,timeout)=>{return(...args)=>{let later=()=>{timeout=null;!immediate&&func(...args);};var callNow=immediate&&!timeout;clearTimeout(timeout);timeout=setTimeout(later,wait||0);callNow&&func(...args);};};const hash=(v,_v=JSON.stringify(v))=>{let hash=0;for(let i=0,len=_v.length;i<len;++i){const c=_v.charCodeAt(i);hash=(hash<<5)-hash+c|0;}return hash;};const m=(selector,attrs=Object.create(null),...children)=>{if(attrs.tag||!(typeof attrs==='object')||attrs instanceof Array||attrs instanceof Function){if(attrs instanceof Array)children.unshift(...attrs);else children.unshift(attrs);attrs=Object.create(null);}let vdom=parseSelector(selector);if(children.length)vdom.children=children;vdom.attrs=attrs;vdom.shouldUpdate=attrs.shouldUpdate;vdom.unload=attrs.unload;vdom.config=attrs.config;vdom.__hash=hash(vdom);delete attrs.unload;delete attrs.shouldUpdate;delete attrs.config;return vdom;};// creatign html, strip events from DOM element... for now just deleting
const stripEvents=({attrs})=>{let a=Object.create(null);if(attrs){for(var name in attrs){if(name[0]==='o'&&name[1]==='n'){a[name]=attrs[name];delete attrs[name];}}}return a;};const applyEvents=(events,el,strip_existing=true)=>{strip_existing&&removeEvents(el);for(var name in events){el[name]=events[name];}};const flatten=(arr,a=[])=>{for(var i=0,len=arr.length;i<len;i++){let v=arr[i];if(!(v instanceof Array)){a.push(v);}else{flatten(v,a);}}return a;};const EVENTS='mouseover,mouseout,wheel,mousemove,blur,focus,click,abort,afterprint,animationend,animationiteration,animationstart,beforeprint,canplay,canplaythrough,change,contextmenu,dblclick,drag,dragend,dragenter,dragleave,dragover,dragstart,drop,durationchange,emptied,ended,error,load,input,invalid,keydown,keypress,keyup,loadeddata,loadedmetadata,mousedown,mouseenter,mouseleave,mouseup,pause,pointercancel,pointerdown,pointerenter,pointerleave,pointermove,pointerout,pointerover,pointerup,play,playing,ratechange,reset,resize,scroll,seeked,seeking,select,selectstart,selectionchange,show,submit,timeupdate,touchstart,touchend,touchcancel,touchmove,touchenter,touchleave,transitionend,volumechange,waiting'.split(',').map(x=>{return'on'+x;});const removeEvents=el=>{// strip away event handlers on el, if it exists
if(!el)return;for(var i in EVENTS){el[i]=null;}};let mnt;const mount=(fn,el)=>{mnt=[el,fn];render(fn,el);};const render=debounce((fn,el)=>{return rAF(_=>{applyUpdates(fn,el.children[0],el);});});const update=()=>{if(!mnt)return;let[el,fn]=mnt;render(fn,el);};const stylify=style=>{let s='';for(var i in style){s+=`${i}:${style[i]};`;}return s;};const setAttrs=({attrs,id,className,__hash},el)=>{if(attrs){for(var attr in attrs){if(attr==='style'){el.style=stylify(attrs[attr]);}else if(attr==='innerHTML'){rAF(()=>{return el.innerHTML=attrs[attr];});}else if(attr==='value'){rAF(()=>{return el.value=attrs[attr];});}else{el.setAttribute(attr,attrs[attr]);}}}let _id=attrs.id||id;if(_id)el.id=_id;let _className=((attrs.className||'')+' '+(className||'')).trim();if(_className)el.className=_className;el.__hash=__hash;};// recycle or create a new el
const createTag=(vdom=Object.create(null),el,parent=el&&el.parentElement)=>{let __vdom=vdom;// make text nodes from primitive types
if(typeof vdom!=='object'){let t=document.createTextNode(vdom);if(el){parent.insertBefore(t,el);removeEl(el);}else{parent.appendChild(t);}return t;}// else make an HTMLElement from "tag" types
let{tag,attrs,id,className,unload,shouldUpdate,config,__hash}=vdom,shouldExchange=!el||!el.tagName||tag&&el.tagName.toLowerCase()!==tag.toLowerCase(),_shouldUpdate=!(shouldUpdate instanceof Function)||shouldUpdate(el);if(!attrs)return;if(el&&(!_shouldUpdate||!vdom instanceof Function&&el.__hash===__hash)){return;}if(shouldExchange){let t=document.createElement(tag);el?(parent.insertBefore(t,el),removeEl(el)):parent.appendChild(t);el=t;}setAttrs(vdom,el);if(el.unload instanceof Function){rAF(el.unload);}if(unload instanceof Function){el.unload=unload;}applyEvents(stripEvents(vdom),el);config&&rAF(_=>{return config(el);});return el;};// find parent element, and remove the input element
const removeEl=el=>{if(!el)return;el.parentElement.removeChild(el);removeEvents(el);// removed for now, added unload logic to the immediate draw()s
if(el.unload instanceof Function)el.unload();};const insertAt=(el,parent,i)=>{if(parent.children.length>i){let next_sib=parent.children[i];parent.insertBefore(el,next_sib);}else{parent.appendChild(el);}};const applyUpdates=(vdom,el,parent=el&&el.parentElement)=>{let v=vdom;// if vdom is a function, execute it until it isn't
while(vdom instanceof Function)vdom=vdom();if(!vdom)return;if(vdom.resolve instanceof Function){let i=parent.children.length;return vdom.resolve().then(v=>{if(!el){let x=createTag(v,null,parent);insertAt(x,parent,i);applyUpdates(v,x,parent);}else{applyUpdates(v,el,parent);}});}// create/edit el under parent
let _el=vdom instanceof Array?parent:createTag(vdom,el,parent);if(!_el)return;if(vdom instanceof Array||vdom.children){let vdom_children=flatten(vdom instanceof Array?vdom:vdom.children),el_children=vdom instanceof Array?parent.childNodes:_el.childNodes;while(el_children.length>vdom_children.length){removeEl(el_children[el_children.length-1]);}for(let i=0;i<vdom_children.length;i++){applyUpdates(vdom_children[i],el_children[i],_el);}}else{while(_el.childNodes.length>0){removeEl(_el.childNodes[_el.childNodes.length-1]);}}};const qs=(s='body',el=document)=>{return el.querySelector(s);};const resolver=(states={})=>{let promises=[],done=false;const _await=(_promises=[])=>{promises=[...promises,..._promises];return finish();};const wait=(ms=0)=>{return new Promise(res=>{return setTimeout(res,ms);});};const isDone=()=>{return done;};const finish=()=>{const total=promises.length;return wait().then(_=>{return Promise.all(promises);}).then(values=>{if(promises.length>total){return finish();}done=true;return states;});};const resolve=props=>{const keys=Object.keys(props);if(!keys.length)return Promise.resolve(true);let f=[];keys.forEach(name=>{let x=props[name];while(x instanceof Function)x=x();if(x&&x.then instanceof Function)f.push(x.then(d=>{return states[name]=d;}));});return _await(f);};const getState=()=>{return states;};return{finish,resolve,getState,promises,isDone};};const gs=(view,state)=>{let r=view(state);while(r instanceof Function)r=view(instance.getState());return r;};const container=(view,queries={},instance=resolver())=>{let wrapper_view=state=>{return instance.isDone()?view(state):m('span');};return()=>{let r=gs(wrapper_view,instance.getState());instance.resolve(queries);if(r instanceof Array){let d=instance.finish().then(_=>{return gs(wrapper_view,instance.getState());});return r.map((x,i)=>{x.resolve=_=>{return d.then(vdom=>{return vdom[i];});};return x;});}r.resolve=_=>{return instance.finish().then(_=>{return gs(wrapper_view,instance.getState());});};return r;};};const reservedAttrs=['className','id'];const toHTML=_vdom=>{while(_vdom instanceof Function)_vdom=_vdom();if(_vdom instanceof Array)return new Promise(r=>{return r(html(..._vdom));});if(!_vdom)return new Promise(r=>{return r('');});if(typeof _vdom!=='object')return new Promise(r=>{return r(_vdom);});return(_vdom.resolve?_vdom.resolve():Promise.resolve()).then(vdom=>{if(!vdom)vdom=_vdom;if(vdom instanceof Array)return new Promise(r=>{return r(html(...vdom));});const{tag,id,className,attrs,children,instance}=vdom,_id=id||attrs&&attrs.id?` id="${id||attrs&&attrs.id||''}"`:'',_class=className||attrs&&attrs.className?` class="${((className||'')+' '+(attrs.className||'')).trim()}"`:'';const events=stripEvents(vdom);let _attrs='',inner='';for(var i in attrs||Object.create(null)){if(i==='style'){_attrs+=` style="${stylify(attrs[i])}"`;}else if(i==='innerHTML'){inner=attrs[i];}else if(reservedAttrs.indexOf(i)===-1){_attrs+=` ${i}="${attrs[i]}"`;}}if(!inner&&children)return html(...children).then(str=>{return`<${tag}${_id}${_class}${_attrs}>${str}</${tag}>`;});if('br,input,img'.split(',').filter(x=>{return x===tag;}).length===0)return new Promise(r=>{return r(`<${tag}${_id}${_class}${_attrs}>${inner}</${tag}>`);});return new Promise(r=>{return r(`<${tag}${_id}${_class}${_attrs} />`);});});};const html=(...v)=>{return Promise.all(v.map(toHTML)).then(x=>{return x.filter(x=>{return!!x;}).join('');});};return{container,html,qs,update,mount,m,debounce};})();/* harmony default export */ exports["a"] = vdom;/*
usage:

let component = () =>
    new Array(20).fill(true).map(x =>
        m('div', {onMouseOver: e => log(e.target.innerHTML)}, range(1,100)))

client-side
-----
mount(component, qs())

client-side constant re-rendering
-----
const run = () => {
    setTimeout(run, 20)
    update()
}
run()
*//* CONTAINER / HTML USAGE (Server-side rendering)

const name = _ => new Promise(res => setTimeout(_ => res('matt'), 1500))

let x = container(data => [
        m('div.test.row', {className:'hola', 'data-name':data.name, style:{border:'1px solid black'}}),
        m('div', data.name),
    ],
    {name}
)

html(x).then(x => log(x)).catch(e => log(e+''))
*/
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ }

/******/ });