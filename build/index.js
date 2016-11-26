module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

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
/***/ function(module, exports) {

"use strict";
'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else{obj[key]=value;}return obj;}// batched requests
// The `fetch()` module batches in-flight requests, so if at any point in time, anywhere in my front-end or
// back-end application I have a calls occur to `fetch('http://api.github.com/users/matthiasak')` while another
// to that URL is "in-flight", the Promise returned by both of those calls will be resolved by a single network request.
// f :: (url -> options) -> Promise
var batch=function batch(f){var inflight={};return function(url){var options=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var method=options.method,key=url+':'+JSON.stringify(options);if((method||'').toLowerCase()==='post')return f(url,_extends({},options,{compress:false}));return inflight[key]||(inflight[key]=new Promise(function(res,rej){f(url,_extends({},options,{compress:false})).then(function(d){return res(d);}).catch(function(e){return rej(e);});}).then(function(data){inflight=_extends({},inflight,_defineProperty({},key,undefined));return data;}).catch(function(e){return console.error(e,url);}));};};exports.default=batch;

/***/ },

/***/ "./src/fp.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {"use strict";Object.defineProperty(exports,"__esModule",{value:true});function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else{return Array.from(arr);}}var log=exports.log=function log(){var _console;return(_console=console).log.apply(_console,arguments);};// rAF
var rAF=exports.rAF=document&&(requestAnimationFrame||webkitRequestAnimationFrame||mozRequestAnimationFrame)||process&&process.nextTick||function(cb){return setTimeout(cb,16.6);};// composition
// c :: (T -> U) -> (U -> V) -> (T -> V)
var c=exports.c=function c(f,g){return function(x){return f(g(x));};};// cof :: [(an -> bn)] -> a0 -> bn
// compose forward
var cof=exports.cof=function cof(){for(var _len=arguments.length,fns=Array(_len),_key=0;_key<_len;_key++){fns[_key]=arguments[_key];}return fns.reduce(function(acc,fn){return c(acc,fn);});};// cob :: [(an -> bn)] -> b0 -> an
// compose backwards
var cob=exports.cob=function cob(){for(var _len2=arguments.length,fns=Array(_len2),_key2=0;_key2<_len2;_key2++){fns[_key2]=arguments[_key2];}return cof.apply(undefined,_toConsumableArray(fns.reverse()));};// functional utilities
// pointfree
var pf=exports.pf=function pf(fn){return function(){for(var _len3=arguments.length,args=Array(_len3),_key3=0;_key3<_len3;_key3++){args[_key3]=arguments[_key3];}return function(x){return fn.apply(x,args);};};};// curry
// curry :: (T -> U) -> [args] -> ( -> U)
var curry=exports.curry=function curry(fn){for(var _len4=arguments.length,args=Array(_len4>1?_len4-1:0),_key4=1;_key4<_len4;_key4++){args[_key4-1]=arguments[_key4];}return fn.bind.apply(fn,[undefined].concat(args));};// Transducers
var mapping=exports.mapping=function mapping(mapper){return(// mapper: x -> y
function(reducer){return(// reducer: (state, value) -> new state
function(result,value){return reducer(result,mapper(value));});});};var filtering=exports.filtering=function filtering(predicate){return(// predicate: x -> true/false
function(reducer){return(// reducer: (state, value) -> new state
function(result,value){return predicate(value)?reducer(result,value):result;});});};var concatter=exports.concatter=function concatter(thing,value){return thing.concat([value]);};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ },

/***/ "./src/hamt.js":
/***/ function(module, exports) {

"use strict";
'use strict';Object.defineProperty(exports,"__esModule",{value:true});// compute the hamming weight
var hamming=exports.hamming=function hamming(x){x-=x>>1&0x55555555;x=(x&0x33333333)+(x>>2&0x33333333);x=x+(x>>4)&0x0f0f0f0f;x+=x>>8;x+=x>>16;return x&0x7f;};var popcount=exports.popcount=function popcount(root){if(root.key)return 1;var c=root.children;if(c){var sum=0;for(var i in c){sum+=popcount(c[i]);}return sum;}};// hash fn
var hash=exports.hash=function hash(){var v=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'';v=JSON.stringify(v);var hash=5381;for(var i=0;i<v.length;i++){hash=(hash<<5)+hash+v.charCodeAt(i);}return hash;};// compare two hashes
var comp=exports.comp=function comp(a,b){return hash(a)===hash(b);};// get a bit vector
var HMAP_SIZE=exports.HMAP_SIZE=8;var MAX_DEPTH=exports.MAX_DEPTH=32/HMAP_SIZE-1;var vec=exports.vec=function vec(){var h=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;var i=arguments.length>1&&arguments[1]!==undefined?arguments[1]:0;var range=arguments.length>2&&arguments[2]!==undefined?arguments[2]:HMAP_SIZE;return h>>>range*i&(1<<range)-1;};var shallowClone=exports.shallowClone=function shallowClone(x){var y=Object.create(null);for(var i in x){y[i]=x[i];}return y;};var cloneNode=exports.cloneNode=function cloneNode(x){var y=node();if(!x)return y;if(x.children){y.children=shallowClone(x.children);}else if(x.key!==undefined){y.key=x.key;y.val=x.val;y.hash=x.hash;}return y;};var numChildren=exports.numChildren=function numChildren(x){var c=0;for(var i in x){++c;}return c;};var set=exports.set=function set(root,key,val){if(root.key===undefined&&!root.children)return node(key,val);var newroot=cloneNode(root),h=hash(key);// walk the tree
for(var i=3,r=root,n=newroot;i>=0;--i){var bits=vec(h,i);if(r.key!==undefined){// if we have a collision
if(r.key===key||i===0){// if keys match or is leaf, just overwrite n's val
n.val=val;}else if(i!==0){// else if r is not at max depth and keys don't match
// add levels to both trees, new tree must be able
// to access old data
// 0. create makeshift value node for r
// and new value node for n
var cp=node(r.key,r.val,r.hash);var cn=node(key,val,h);var rh=r.hash;// 1. delete value props from nodes
delete r.key;delete r.val;delete r.hash;delete n.key;delete n.val;delete n.hash;// 2. create layers until bit-vectors don't collide
for(var j=i,__r=r,__n=n;j>=0;j--){var vecr=vec(rh,j),vecn=vec(h,j);// create new layer for c and r
var c=__r.children=Object.create(null);var d=__n.children=shallowClone(c);if(vecr!==vecn){c[vecr]=cp;d[vecr]=cp;d[vecn]=cn;break;}else{__r=c[vecr]=node();__n=d[vecn]=cloneNode(__r);}}}break;}else if(r.children){var _r=r.children[bits];if(!_r){n=n.children[bits]=node(key,val);break;}else{r=_r;n=n.children[bits]=cloneNode(r);}}}return newroot;};var get=exports.get=function get(root,key){if(root.key===key)return root.val;var h=hash(key);for(var i=3,r=root;i>=0;--i){if(!r.children)return undefined;r=r.children[vec(h,i)];if(!r)return undefined;if(r.key!==undefined)return r.val;}return undefined;};var first=exports.first=function first(root){var c=root.children;for(var i in c){return c[i];}};var unset=exports.unset=function unset(root,key){var n=cloneNode(root),h=hash(key);for(var i=3,_n=n,p=n;i>=-1;--i){if(_n.key){delete _n.key;delete _n.val;delete _n.hash;return n;//             let c = numChildren(p)
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
}var bits=vec(h,i);_n=_n&&_n.children&&_n.children[bits];if(!_n)return n;p=_n;}return n;};var node=exports.node=function node(key,val){var h=arguments.length>2&&arguments[2]!==undefined?arguments[2]:key!==undefined&&hash(key);/*
    potential props of a tree node
    - key - hashkey
    - val - value
    - children - { ... } -> points to other nodes (List<Node> children)
    */var item=Object.create(null);if(key!==undefined){item.key=key;item.hash=h;item.val=val;}return item;};var map=exports.map=function map(root,fn){if(root.key!==undefined)return node(root.key,fn(root.val,root.key),root.hash);var d=cloneNode(root),c=d.children;if(c){for(var i in c){c[i]=map(c[i],fn);}}return d;};var filter=exports.filter=function filter(root,fn){if(root.key!==undefined)return fn(root.val,root.key)?root:undefined;var d=cloneNode(root),c=d.children;if(c){for(var i in c){if(!filter(c[i],fn))delete c[i];}}return d;};var reduce=exports.reduce=function reduce(root,fn,acc){if(root.key!==undefined)return fn(acc,root.val,root.key);var c=root.children;if(c){for(var i in c){acc=reduce(c[i],fn,acc);}return acc;}};var toList=exports.toList=function toList(root){var r=arguments.length>1&&arguments[1]!==undefined?arguments[1]:[];if(root.key!==undefined)r.push(root.val);var c=root.children;if(c){for(var i in c){toList(c[i],r);}}return r;};var toOrderedList=exports.toOrderedList=function toOrderedList(root){var r=arguments.length>1&&arguments[1]!==undefined?arguments[1]:[];var i=0,n=void 0;do{n=get(root,i++);n!==undefined&&r.push(n);}while(n);return r;};var toJSON=exports.toJSON=function toJSON(root){var r=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};if(root.key!==undefined)r[root.key]=root.val;var c=root.children;if(c){for(var i in c){toJson(c[i],r);}}return r;};var push=exports.push=function push(root,val){return set(root,popcount(root),val);};var pop=exports.pop=function pop(root){return unset(root,popcount(root)-1);};var shift=exports.shift=function shift(root){return reduce(unset(root,0),function(acc,v,k){return set(acc,k-1,v);},node());};var unshift=exports.unshift=function unshift(root,val){return set(reduce(root,function(acc,v,k){return set(acc,k+1,v);},node()),0,val);};var hamt=exports.hamt=node;// console.clear()
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

/***/ "./src/index.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.hamt=exports.obs=exports.model=exports.mixin=exports.vdom=exports.batch=undefined;var _fp=__webpack_require__("./src/fp.js");Object.keys(_fp).forEach(function(key){if(key==="default"||key==="__esModule")return;Object.defineProperty(exports,key,{enumerable:true,get:function get(){return _fp[key];}});});var _batch2=__webpack_require__("./src/batch.js");var _batch3=_interopRequireDefault(_batch2);var _vdom2=__webpack_require__("./src/vdom.js");var _vdom3=_interopRequireDefault(_vdom2);var _mixin2=__webpack_require__("./src/mixin.js");var _mixin3=_interopRequireDefault(_mixin2);var _model2=__webpack_require__("./src/model.js");var _model3=_interopRequireDefault(_model2);var _observable=__webpack_require__("./src/observable.js");var _observable2=_interopRequireDefault(_observable);var _hamt2=__webpack_require__("./src/hamt.js");var _hamt=_interopRequireWildcard(_hamt2);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}exports.batch=_batch3.default;exports.vdom=_vdom3.default;exports.mixin=_mixin3.default;exports.model=_model3.default;exports.obs=_observable2.default;exports.hamt=_hamt;

/***/ },

/***/ "./src/mixin.js":
/***/ function(module, exports) {

"use strict";
"use strict";Object.defineProperty(exports,"__esModule",{value:true});function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var mixin=function mixin(){for(var _len=arguments.length,classes=Array(_len),_key=0;_key<_len;_key++){classes[_key]=arguments[_key];}var _mixin=function _mixin(){_classCallCheck(this,_mixin);};var proto=_mixin.prototype;classes.map(function(_ref){var p=_ref.prototype;Object.getOwnPropertyNames(p).map(function(key){var oldFn=proto[key]||function(){};proto[key]=function(){oldFn.apply(undefined,arguments);return p[key].apply(p,arguments);};});});return _mixin;};exports.default=mixin;

/***/ },

/***/ "./src/model.js":
/***/ function(module, exports) {

"use strict";
'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};// Validate JS objects for their "shape"
var model={is:function is(type,value){if(type&&type.isValid instanceof Function){return type.isValid(value);}else if(type===String&&(value instanceof String||typeof value==='string')||type===Number&&(value instanceof Number||typeof value==='number')||type===Boolean&&(value instanceof Boolean||typeof value==='boolean')||type===Function&&(value instanceof Function||typeof value==='function')||type===Object&&(value instanceof Object||(typeof value==='undefined'?'undefined':_typeof(value))==='object')||type===undefined){return true;}return false;},check:function check(types,required,data){Object.keys(types).forEach(function(key){var t=types[key],value=data[key];if(required[key]||value!==undefined){if(!(t instanceof Array))t=[t];var i=t.reduce(function(a,_type){return a||MODEL.is(_type,value);},false);if(!i){throw'{'+key+': '+JSON.stringify(value)+'} is not one of '+t.map(function(x){return'\n - '+x;});}}});return true;},init:function init(){var types=void 0,required=void 0,logic=void 0;for(var _len=arguments.length,args=Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}args.map(function(x){if(x instanceof Function&&!logic){logic=x;}else if((typeof x==='undefined'?'undefined':_typeof(x))==='object'){if(!types){types=x;}else if(!required){required=x;}}});var isValid=function isValid(data){var pipe=logic?[check,logic]:[check];return pipe.reduce(function(a,v){return a&&v(types||{},required||{},data);},true);};var whenValid=function whenValid(data){return new Promise(function(res,rej){return isValid(data)&&res(data);});};return{isValid:isValid,whenValid:whenValid};},ArrayOf:function ArrayOf(M){return MODEL.init(function(t,r,data){if(!(data instanceof Array))throw data+' not an Array';data.map(function(x){if(!MODEL.is(M,x))throw x+' is not a model instance';});return true;});}};exports.default=model;/**
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
/* WEBPACK VAR INJECTION */(function(process) {"use strict";Object.defineProperty(exports,"__esModule",{value:true});var rAF=document&&(requestAnimationFrame||webkitRequestAnimationFrame||mozRequestAnimationFrame)||process&&process.nextTick||function(cb){return setTimeout(cb,16.6);};// observables
var obs=function obs(state){var subscribers=new Set();var fn=function fn(val){if(val!==undefined){state=val;var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=subscribers[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var i=_step.value;i(val);}}catch(err){_didIteratorError=true;_iteratorError=err;}finally{try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return();}}finally{if(_didIteratorError){throw _iteratorError;}}}}return state;};fn.map=function(f){var o=obs();subscribers.add(function(val){return o(f(val));});return o;};fn.filter=function(f){var o=obs();subscribers.add(function(val){return f(val)&&o(val);});return o;};fn.then=function(f){subscribers.add(function(val){return f(val);});return fn;};fn.take=function(n){var values=[],o=obs();var cb=function cb(val){if(values.length<n)values.push(val);if(values.length===n){subscribers.delete(cb);return o(values);}};subscribers.add(cb);return o;};fn.takeWhile=function(f){var values=[],o=obs();var cb=function cb(val){if(!f(val)){subscribers.delete(cb);return o(values);}values.push(val);};subscribers.add(cb);return o;};fn.reduce=function(f,acc){var o=obs();subscribers.add(function(val){acc=f(acc,val);o(acc);});return o;};fn.maybe=function(f){var success=obs(),error=obs(),cb=function cb(val){return f(val).then(function(d){return success(d);}).catch(function(e){return error(e);});};subscribers.add(cb);return[success,error];};fn.stop=function(){return subscribers.clear();};fn.debounce=function(ms){var o=obs();var ts=+new Date();subscribers.add(function(val){var now=+new Date();if(now-ts>=ms){ts=+new Date();o(val);}});return o;};return fn;};obs.from=function(f){var o=obs();f(function(x){return o(x);});return o;};obs.union=function(){for(var _len=arguments.length,fs=Array(_len),_key=0;_key<_len;_key++){fs[_key]=arguments[_key];}var o=obs();fs.map(function(f){return f.then(o);});return o;};exports.default=obs;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js")))

/***/ },

/***/ "./src/vdom.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _slicedToArray=function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break;}}catch(err){_d=true;_e=err;}finally{try{if(!_n&&_i["return"])_i["return"]();}finally{if(_d)throw _e;}}return _arr;}return function(arr,i){if(Array.isArray(arr)){return arr;}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i);}else{throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else{return Array.from(arr);}}var rAF=document&&(requestAnimationFrame||webkitRequestAnimationFrame||mozRequestAnimationFrame)||process&&process.nextTick||function(cb){return setTimeout(cb,16.6);};// Virtual DOMs
var vdom=function(){var class_id_regex=function class_id_regex(){return /[#\.][^#\.]+/ig;},tagName_regex=function tagName_regex(){return /^([^\.#]+)\b/i;};var parseSelector=function parseSelector(s){var test=null,tagreg=tagName_regex().exec(s),tag=tagreg&&tagreg.slice(1)[0],reg=class_id_regex(),vdom=Object.create(null);if(tag)s=s.substr(tag.length);vdom.className='';vdom.tag=tag||'div';while((test=reg.exec(s))!==null){test=test[0];if(test[0]==='.')vdom.className=(vdom.className+' '+test.substr(1)).trim();else if(test[0]==='#')vdom.id=test.substr(1);}return vdom;};var debounce=function debounce(func,wait,immediate,timeout){return function(){for(var _len=arguments.length,args=Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}var later=function later(){timeout=null;!immediate&&func.apply(undefined,args);};var callNow=immediate&&!timeout;clearTimeout(timeout);timeout=setTimeout(later,wait||0);callNow&&func.apply(undefined,args);};};var hash=function hash(v){var _v=arguments.length>1&&arguments[1]!==undefined?arguments[1]:JSON.stringify(v);var hash=0;for(var i=0,len=_v.length;i<len;++i){var c=_v.charCodeAt(i);hash=(hash<<5)-hash+c|0;}return hash;};var m=function m(selector){for(var _len2=arguments.length,children=Array(_len2>2?_len2-2:0),_key2=2;_key2<_len2;_key2++){children[_key2-2]=arguments[_key2];}var attrs=arguments.length>1&&arguments[1]!==undefined?arguments[1]:Object.create(null);if(attrs.tag||!((typeof attrs==='undefined'?'undefined':_typeof(attrs))==='object')||attrs instanceof Array||attrs instanceof Function){if(attrs instanceof Array)children.unshift.apply(children,_toConsumableArray(attrs));else children.unshift(attrs);attrs=Object.create(null);}var vdom=parseSelector(selector);if(children.length)vdom.children=children;vdom.attrs=attrs;vdom.shouldUpdate=attrs.shouldUpdate;vdom.unload=attrs.unload;vdom.config=attrs.config;vdom.__hash=hash(vdom);delete attrs.unload;delete attrs.shouldUpdate;delete attrs.config;return vdom;};// creatign html, strip events from DOM element... for now just deleting
var stripEvents=function stripEvents(_ref){var attrs=_ref.attrs;var a=Object.create(null);if(attrs){for(var name in attrs){if(name[0]==='o'&&name[1]==='n'){a[name]=attrs[name];delete attrs[name];}}}return a;};var applyEvents=function applyEvents(events,el){var strip_existing=arguments.length>2&&arguments[2]!==undefined?arguments[2]:true;strip_existing&&removeEvents(el);for(var name in events){el[name]=events[name];}};var flatten=function flatten(arr){var a=arguments.length>1&&arguments[1]!==undefined?arguments[1]:[];for(var i=0,len=arr.length;i<len;i++){var v=arr[i];if(!(v instanceof Array)){a.push(v);}else{flatten(v,a);}}return a;};var EVENTS='mouseover,mouseout,wheel,mousemove,blur,focus,click,abort,afterprint,animationend,animationiteration,animationstart,beforeprint,canplay,canplaythrough,change,contextmenu,dblclick,drag,dragend,dragenter,dragleave,dragover,dragstart,drop,durationchange,emptied,ended,error,load,input,invalid,keydown,keypress,keyup,loadeddata,loadedmetadata,mousedown,mouseenter,mouseleave,mouseup,pause,pointercancel,pointerdown,pointerenter,pointerleave,pointermove,pointerout,pointerover,pointerup,play,playing,ratechange,reset,resize,scroll,seeked,seeking,select,selectstart,selectionchange,show,submit,timeupdate,touchstart,touchend,touchcancel,touchmove,touchenter,touchleave,transitionend,volumechange,waiting'.split(',').map(function(x){return'on'+x;});var removeEvents=function removeEvents(el){// strip away event handlers on el, if it exists
if(!el)return;for(var i in EVENTS){el[i]=null;}};var mnt=void 0;var mount=function mount(fn,el){mnt=[el,fn];render(fn,el);};var render=debounce(function(fn,el){return rAF(function(_){applyUpdates(fn,el.children[0],el);});});var update=function update(){if(!mnt)return;var _mnt=mnt,_mnt2=_slicedToArray(_mnt,2),el=_mnt2[0],fn=_mnt2[1];render(fn,el);};var stylify=function stylify(style){var s='';for(var i in style){s+=i+':'+style[i]+';';}return s;};var setAttrs=function setAttrs(_ref2,el){var attrs=_ref2.attrs,id=_ref2.id,className=_ref2.className,__hash=_ref2.__hash;if(attrs){for(var attr in attrs){if(attr==='style'){el.style=stylify(attrs[attr]);}else if(attr==='innerHTML'){rAF(function(){return el.innerHTML=attrs[attr];});}else if(attr==='value'){rAF(function(){return el.value=attrs[attr];});}else{el.setAttribute(attr,attrs[attr]);}}}var _id=attrs.id||id;if(_id)el.id=_id;var _className=((attrs.className||'')+' '+(className||'')).trim();if(_className)el.className=_className;el.__hash=__hash;};// recycle or create a new el
var createTag=function createTag(){var vdom=arguments.length>0&&arguments[0]!==undefined?arguments[0]:Object.create(null);var el=arguments[1];var parent=arguments.length>2&&arguments[2]!==undefined?arguments[2]:el&&el.parentElement;var __vdom=vdom;// make text nodes from primitive types
if((typeof vdom==='undefined'?'undefined':_typeof(vdom))!=='object'){var t=document.createTextNode(vdom);if(el){parent.insertBefore(t,el);removeEl(el);}else{parent.appendChild(t);}return t;}// else make an HTMLElement from "tag" types
var tag=vdom.tag,attrs=vdom.attrs,id=vdom.id,className=vdom.className,unload=vdom.unload,shouldUpdate=vdom.shouldUpdate,config=vdom.config,__hash=vdom.__hash,shouldExchange=!el||!el.tagName||tag&&el.tagName.toLowerCase()!==tag.toLowerCase(),_shouldUpdate=!(shouldUpdate instanceof Function)||shouldUpdate(el);if(!attrs)return;if(el&&(!_shouldUpdate||!vdom instanceof Function&&el.__hash===__hash)){return;}if(shouldExchange){var _t=document.createElement(tag);el?(parent.insertBefore(_t,el),removeEl(el)):parent.appendChild(_t);el=_t;}setAttrs(vdom,el);if(el.unload instanceof Function){rAF(el.unload);}if(unload instanceof Function){el.unload=unload;}applyEvents(stripEvents(vdom),el);config&&rAF(function(_){return config(el);});return el;};// find parent element, and remove the input element
var removeEl=function removeEl(el){if(!el)return;el.parentElement.removeChild(el);removeEvents(el);// removed for now, added unload logic to the immediate draw()s
if(el.unload instanceof Function)el.unload();};var insertAt=function insertAt(el,parent,i){if(parent.children.length>i){var next_sib=parent.children[i];parent.insertBefore(el,next_sib);}else{parent.appendChild(el);}};var applyUpdates=function applyUpdates(vdom,el){var parent=arguments.length>2&&arguments[2]!==undefined?arguments[2]:el&&el.parentElement;var v=vdom;// if vdom is a function, execute it until it isn't
while(vdom instanceof Function){vdom=vdom();}if(!vdom)return;if(vdom.resolve instanceof Function){var _ret=function(){var i=parent.children.length;return{v:vdom.resolve().then(function(v){if(!el){var x=createTag(v,null,parent);insertAt(x,parent,i);applyUpdates(v,x,parent);}else{applyUpdates(v,el,parent);}})};}();if((typeof _ret==='undefined'?'undefined':_typeof(_ret))==="object")return _ret.v;}// create/edit el under parent
var _el=vdom instanceof Array?parent:createTag(vdom,el,parent);if(!_el)return;if(vdom instanceof Array||vdom.children){var vdom_children=flatten(vdom instanceof Array?vdom:vdom.children),el_children=vdom instanceof Array?parent.childNodes:_el.childNodes;while(el_children.length>vdom_children.length){removeEl(el_children[el_children.length-1]);}for(var _i=0;_i<vdom_children.length;_i++){applyUpdates(vdom_children[_i],el_children[_i],_el);}}else{while(_el.childNodes.length>0){removeEl(_el.childNodes[_el.childNodes.length-1]);}}};var qs=function qs(){var s=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'body';var el=arguments.length>1&&arguments[1]!==undefined?arguments[1]:document;return el.querySelector(s);};var resolver=function resolver(){var states=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var promises=[],done=false;var _await=function _await(){var _promises=arguments.length>0&&arguments[0]!==undefined?arguments[0]:[];promises=[].concat(_toConsumableArray(promises),_toConsumableArray(_promises));return finish();};var wait=function wait(){var ms=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;return new Promise(function(res){return setTimeout(res,ms);});};var isDone=function isDone(){return done;};var finish=function finish(){var total=promises.length;return wait().then(function(_){return Promise.all(promises);}).then(function(values){if(promises.length>total){return finish();}done=true;return states;});};var resolve=function resolve(props){var keys=Object.keys(props);if(!keys.length)return Promise.resolve(true);var f=[];keys.forEach(function(name){var x=props[name];while(x instanceof Function){x=x();}if(x&&x.then instanceof Function)f.push(x.then(function(d){return states[name]=d;}));});return _await(f);};var getState=function getState(){return states;};return{finish:finish,resolve:resolve,getState:getState,promises:promises,isDone:isDone};};var gs=function gs(view,state){var r=view(state);while(r instanceof Function){r=view(instance.getState());}return r;};var container=function container(view){var queries=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var instance=arguments.length>2&&arguments[2]!==undefined?arguments[2]:resolver();var wrapper_view=function wrapper_view(state){return instance.isDone()?view(state):m('span');};return function(){var r=gs(wrapper_view,instance.getState());instance.resolve(queries);if(r instanceof Array){var _ret2=function(){var d=instance.finish().then(function(_){return gs(wrapper_view,instance.getState());});return{v:r.map(function(x,i){x.resolve=function(_){return d.then(function(vdom){return vdom[i];});};return x;})};}();if((typeof _ret2==='undefined'?'undefined':_typeof(_ret2))==="object")return _ret2.v;}r.resolve=function(_){return instance.finish().then(function(_){return gs(wrapper_view,instance.getState());});};return r;};};var reservedAttrs=['className','id'];var toHTML=function toHTML(_vdom){while(_vdom instanceof Function){_vdom=_vdom();}if(_vdom instanceof Array)return new Promise(function(r){return r(html.apply(undefined,_toConsumableArray(_vdom)));});if(!_vdom)return new Promise(function(r){return r('');});if((typeof _vdom==='undefined'?'undefined':_typeof(_vdom))!=='object')return new Promise(function(r){return r(_vdom);});return(_vdom.resolve?_vdom.resolve():Promise.resolve()).then(function(vdom){if(!vdom)vdom=_vdom;if(vdom instanceof Array)return new Promise(function(r){return r(html.apply(undefined,_toConsumableArray(vdom)));});var _vdom2=vdom,tag=_vdom2.tag,id=_vdom2.id,className=_vdom2.className,attrs=_vdom2.attrs,children=_vdom2.children,instance=_vdom2.instance,_id=id||attrs&&attrs.id?' id="'+(id||attrs&&attrs.id||'')+'"':'',_class=className||attrs&&attrs.className?' class="'+((className||'')+' '+(attrs.className||'')).trim()+'"':'';var events=stripEvents(vdom);var _attrs='',inner='';for(var i in attrs||Object.create(null)){if(i==='style'){_attrs+=' style="'+stylify(attrs[i])+'"';}else if(i==='innerHTML'){inner=attrs[i];}else if(reservedAttrs.indexOf(i)===-1){_attrs+=' '+i+'="'+attrs[i]+'"';}}if(!inner&&children)return html.apply(undefined,_toConsumableArray(children)).then(function(str){return'<'+tag+_id+_class+_attrs+'>'+str+'</'+tag+'>';});if('br,input,img'.split(',').filter(function(x){return x===tag;}).length===0)return new Promise(function(r){return r('<'+tag+_id+_class+_attrs+'>'+inner+'</'+tag+'>');});return new Promise(function(r){return r('<'+tag+_id+_class+_attrs+' />');});});};var html=function html(){for(var _len3=arguments.length,v=Array(_len3),_key3=0;_key3<_len3;_key3++){v[_key3]=arguments[_key3];}return Promise.all(v.map(toHTML)).then(function(x){return x.filter(function(x){return!!x;}).join('');});};return{container:container,html:html,qs:qs,update:update,mount:mount,m:m,debounce:debounce};}();exports.default=vdom;/*
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
//# sourceMappingURL=index.js.map