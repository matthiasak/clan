(function(FuseBox){
FuseBox.pkg("clan-fp", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){ 

'use strict';Object.defineProperty(exports,'__esModule',{value:!0});exports.hash=void 0;var _batch=require('./batch'),_batch2=_interopRequireDefault(_batch),_vdom=require('./vdom'),_vdom2=_interopRequireDefault(_vdom),_mixin=require('./mixin'),_mixin2=_interopRequireDefault(_mixin),_model=require('./model'),_model2=_interopRequireDefault(_model),_observable=require('./observable'),_observable2=_interopRequireDefault(_observable),_hamt=require('./hamt'),hamt=_interopRequireWildcard(_hamt),_worker=require('./worker'),worker=_interopRequireWildcard(_worker),_fp=require('./fp'),fp=_interopRequireWildcard(_fp);function _interopRequireWildcard(obj){if(obj&&obj.__esModule)return obj;var newObj={};if(null!=obj)for(var key in obj)Object.prototype.hasOwnProperty.call(obj,key)&&(newObj[key]=obj[key]);return newObj.default=obj,newObj}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var hash=exports.hash=function hash(a){var b=1<arguments.length&&void 0!==arguments[1]?arguments[1]:JSON.stringify(a),d=0;for(var e=0,f=b.length;e<f;++e){var g=b.charCodeAt(e);d=0|(d<<5)-d+g}return d};module.exports={batch:_batch2.default,vdom:_vdom2.default,mixin:_mixin2.default,model:_model2.default,obs:_observable2.default,hamt:hamt,worker:worker,fp:fp};
});
___scope___.file("batch.js", function(exports, require, module, __filename, __dirname){ 

'use strict';Object.defineProperty(exports,'__esModule',{value:!0});function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}// batched requests
// The `fetch()` module batches in-flight requests, so if at any point in time, anywhere in my front-end or
// back-end application I have a calls occur to `fetch('http://api.github.com/users/matthiasak')` while another
// to that URL is "in-flight", the Promise returned by both of those calls will be resolved by a single network request.
// f :: (url -> options) -> Promise
var batch=function batch(a){var b={};return function(c){var g=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},h=g.method,i=c+':'+JSON.stringify(g);return'post'===(h||'').toLowerCase()?a(c,Object.assign({},g,{compress:!1})):b[i]||(b[i]=new Promise(function(j,k){a(c,Object.assign({},g,{compress:!1})).then(function(l){return j(l)}).catch(function(l){return k(l)})}).then(function(j){return b=Object.assign({},b,_defineProperty({},i,void 0)),j}).catch(function(j){return console.error(j,c)}))}};exports.default=batch;
});
___scope___.file("vdom.js", function(exports, require, module, __filename, __dirname){ 

'use strict';var _slicedToArray=function(){function sliceIterator(arr,i){var _arr=[],_n=!0,_d=!1,_e=void 0;try{for(var _s,_i=arr[Symbol.iterator]();!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!(i&&_arr.length===i));_n=!0);}catch(err){_d=!0,_e=err}finally{try{!_n&&_i['return']&&_i['return']()}finally{if(_d)throw _e}}return _arr}return function(arr,i){if(Array.isArray(arr))return arr;if(Symbol.iterator in Object(arr))return sliceIterator(arr,i);throw new TypeError('Invalid attempt to destructure non-iterable instance')}}();var _typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&'function'==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?'symbol':typeof obj},rAF='undefined'!=typeof document&&(requestAnimationFrame||webkitRequestAnimationFrame||mozRequestAnimationFrame)||function(b){return setTimeout(b,16.6)},vdom=function vdom(){var b=function b(){return /[#\.][^#\.]+/ig},e=function e(){return /^([^\.#]+)\b/i},g=function g(J){var K=null,L=e().exec(J),M=L&&L.slice(1)[0],N=b(),O=Object.create(null);for(M&&(J=J.substr(M.length)),O.className='',O.tag=M||'div';null!==(K=N.exec(J));)K=K[0],'.'===K[0]?O.className=(O.className+' '+K.substr(1)).trim():'#'===K[0]&&(O.id=K.substr(1));return O},h=function h(J,K,L,M){return function(){for(var _len=arguments.length,N=Array(_len),_key=0;_key<_len;_key++)N[_key]=arguments[_key];var O=L&&!M;clearTimeout(M),M=setTimeout(function(){M=null,L||J.apply(void 0,N)},K||0),O&&J.apply(void 0,N)}},j=function j(J){var K=1<arguments.length&&void 0!==arguments[1]?arguments[1]:JSON.stringify(J),L=0;for(var M=0,N=K.length;M<N;++M){var O=K.charCodeAt(M);L=0|(L<<5)-L+O}return L},k=function k(J){for(var _len2=arguments.length,L=Array(2<_len2?_len2-2:0),_key2=2;_key2<_len2;_key2++)L[_key2-2]=arguments[_key2];var K=1<arguments.length&&void 0!==arguments[1]?arguments[1]:Object.create(null);(K.tag||'object'!=('undefined'==typeof K?'undefined':_typeof(K))||K instanceof Array||K instanceof Function)&&(K instanceof Array?L.unshift.apply(L,_toConsumableArray(K)):L.unshift(K),K=Object.create(null));var M=g(J);return L.length&&(M.children=L),M.attrs=K,M.shouldUpdate=K.shouldUpdate,M.unload=K.unload,M.config=K.config,M.__hash=j(M),delete K.unload,delete K.shouldUpdate,delete K.config,M},l=function l(_ref){var J=_ref.attrs,K=Object.create(null);if(J)for(var L in J)'o'===L[0]&&'n'===L[1]&&(K[L]=J[L],delete J[L]);return K},n=function n(J,K){var L=2<arguments.length&&void 0!==arguments[2]?arguments[2]:!0;for(var M in L&&q(K),J)K[M]=J[M]},o=function o(J){var K=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[];for(var L=0,M=J.length;L<M;L++){var N=J[L];N instanceof Array?o(N,K):K.push(N)}return K},p='mouseover,mouseout,wheel,mousemove,blur,focus,click,abort,afterprint,animationend,animationiteration,animationstart,beforeprint,canplay,canplaythrough,change,contextmenu,dblclick,drag,dragend,dragenter,dragleave,dragover,dragstart,drop,durationchange,emptied,ended,error,load,input,invalid,keydown,keypress,keyup,loadeddata,loadedmetadata,mousedown,mouseenter,mouseleave,mouseup,pause,pointercancel,pointerdown,pointerenter,pointerleave,pointermove,pointerout,pointerover,pointerup,play,playing,ratechange,reset,resize,scroll,seeked,seeking,select,selectstart,selectionchange,show,submit,timeupdate,touchstart,touchend,touchcancel,touchmove,touchenter,touchleave,transitionend,volumechange,waiting'.split(',').map(function(J){return'on'+J}),q=function q(J){// strip away event handlers on el, if it exists
if(J)for(var K in p)J[K]=null},u=void 0,w=h(function(J,K){return rAF(function(){D(J,K.children[0],K)})}),y=function y(J){var K='';for(var L in J)K+=L+':'+J[L]+';';return K},z=function z(_ref2,N){var J=_ref2.attrs,K=_ref2.id,L=_ref2.className,M=_ref2.__hash;if(N.className='',N.style='',J)for(var O in J)'style'==O?N.style=y(J[O]):'innerHTML'==O?rAF(function(){return N.innerHTML=J[O]}):'value'==O?rAF(function(){return N.value=J[O]}):N.setAttribute(O,J[O]);var P=J.id||K;P&&(N.id=P);var Q=((J.className||'')+' '+(L||'')).trim();Q&&(N.className=Q),N.__hash=M},A=function A(){var J=0<arguments.length&&void 0!==arguments[0]?arguments[0]:Object.create(null),L=2<arguments.length&&void 0!==arguments[2]?arguments[2]:K&&K.parentElement,K=arguments[1];// make text nodes from primitive types
if('object'!=('undefined'==typeof J?'undefined':_typeof(J))){var W=document.createTextNode(J);return K?(L.insertBefore(W,K),B(K)):L.appendChild(W),W}// else make an HTMLElement from "tag" types
var M=J.tag,N=J.attrs,O=J.id,P=J.className,Q=J.unload,R=J.shouldUpdate,S=J.config,T=J.__hash,U=!K||!K.tagName||M&&K.tagName.toLowerCase()!==M.toLowerCase(),V=!(R instanceof Function)||R(K);if(N&&!(K&&(!V||!J instanceof Function&&K.__hash===T))){if(U){var _W=document.createElement(M);K?(L.insertBefore(_W,K),B(K)):L.appendChild(_W),K=_W}return z(J,K),K.unload instanceof Function&&rAF(K.unload),Q instanceof Function&&(K.unload=Q),n(l(J),K),S&&rAF(function(){return S(K)}),K}},B=function B(J){J&&(J.parentElement.removeChild(J),q(J),J.unload instanceof Function&&J.unload())},C=function C(J,K,L){if(K.children.length>L){var M=K.children[L];K.insertBefore(J,M)}else K.appendChild(J)},D=function D(J,K){// if vdom is a function, execute it until it isn't
for(var L=2<arguments.length&&void 0!==arguments[2]?arguments[2]:K&&K.parentElement;J instanceof Function;)J=J();if(J){if(J.resolve instanceof Function){var _ret=function(){var N=L.children.length;return{v:J.resolve().then(function(O){if(!K){var P=A(O,null,L);C(P,L,N),D(O,P,L)}else D(O,K,L)})}}();if('object'==('undefined'==typeof _ret?'undefined':_typeof(_ret)))return _ret.v}// create/edit el under parent
var _M=J instanceof Array?L:A(J,K,L);if(_M)if(J instanceof Array||J.children){for(var _N2=o(J instanceof Array?J:J.children),_O2=J instanceof Array?L.childNodes:_M.childNodes;_O2.length>_N2.length;)B(_O2[_O2.length-1]);for(var _P2=0;_P2<N.length;_P2++)D(N[_P2],O[_P2],_M)}else for(;0<_M.childNodes.length;)B(_M.childNodes[_M.childNodes.length-1])}},E=function E(){var J=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},K=[],L=!1,M=function M(){var P=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[];return K=[].concat(_toConsumableArray(K),_toConsumableArray(P)),O()},N=function N(){var P=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0;return new Promise(function(Q){return setTimeout(Q,P)})},O=function O(){var P=K.length;return N().then(function(){return Promise.all(K)}).then(function(){return K.length>P?O():(L=!0,J)})};return{finish:O,resolve:function resolve(P){var Q=Object.keys(P);if(!Q.length)return Promise.resolve(!0);var R=[];return Q.forEach(function(S){for(var T=P[S];T instanceof Function;)T=T();T&&T.then instanceof Function&&R.push(T.then(function(U){return J[S]=U}))}),M(R)},getState:function getState(){return J},promises:K,isDone:function isDone(){return L}}},F=function F(J,K){for(var L=J(K);L instanceof Function;)L=J(instance.getState());return L},G=['className','id'],H=function H(J){for(;J instanceof Function;)J=J();return J instanceof Array?new Promise(function(K){return K(I.apply(void 0,_toConsumableArray(J)))}):J?'object'==('undefined'==typeof J?'undefined':_typeof(J))?(J.resolve?J.resolve():Promise.resolve()).then(function(K){if(K||(K=J),K instanceof Array)return new Promise(function(W){return W(I.apply(void 0,_toConsumableArray(K)))});var _K=K,L=_K.tag,M=_K.id,N=_K.className,O=_K.attrs,P=_K.children,Q=_K.instance,R=M||O&&O.id?' id="'+(M||O&&O.id||'')+'"':'',S=N||O&&O.className?' class="'+((N||'')+' '+(O.className||'')).trim()+'"':'';l(K);var T='',U='';for(var V in O||Object.create(null))'style'==V?T+=' style="'+y(O[V])+'"':'innerHTML'==V?U=O[V]:-1===G.indexOf(V)&&(T+=' '+V+'="'+O[V]+'"');return!U&&P?I.apply(void 0,_toConsumableArray(P)).then(function(W){return'<'+L+R+S+T+'>'+W+'</'+L+'>'}):0==='br,input,img'.split(',').filter(function(W){return W===L}).length?new Promise(function(W){return W('<'+L+R+S+T+'>'+U+'</'+L+'>')}):new Promise(function(W){return W('<'+L+R+S+T+' />')})}):new Promise(function(K){return K(J)}):new Promise(function(K){return K('')})},I=function I(){for(var _len3=arguments.length,J=Array(_len3),_key3=0;_key3<_len3;_key3++)J[_key3]=arguments[_key3];return Promise.all(J.map(H)).then(function(K){return K.filter(function(L){return!!L}).join('')})};// creatign html, strip events from DOM element... for now just deleting
// recycle or create a new el
// find parent element, and remove the input element
return{container:function container(J){var K=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},L=2<arguments.length&&void 0!==arguments[2]?arguments[2]:E(),M=function M(N){return L.isDone()?J(N):k('span')};return function(){var N=F(M,L.getState());if(L.resolve(K),N instanceof Array){var _ret2=function(){var O=L.finish().then(function(){return F(M,L.getState())});return{v:N.map(function(P,Q){return P.resolve=function(){return O.then(function(R){return R[Q]})},P})}}();if('object'==('undefined'==typeof _ret2?'undefined':_typeof(_ret2)))return _ret2.v}return N.resolve=function(){return L.finish().then(function(){return F(M,L.getState())})},N}},html:I,qs:function qs(){var J=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'body',K=1<arguments.length&&void 0!==arguments[1]?arguments[1]:document;return K.querySelector(J)},update:function update(){if(u){var _u=u,_u2=_slicedToArray(_u,2),J=_u2[0],K=_u2[1];w(K,J)}},mount:function mount(J,K){u=[K,J],w(J,K)},m:k,debounce:h}};function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++)arr2[i]=arr[i];return arr2}return Array.from(arr)}// Virtual DOMs
module.exports=vdom();
});
___scope___.file("mixin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var mixin=function mixin(){for(var _len=arguments.length,a=Array(_len),_key=0;_key<_len;_key++)a[_key]=arguments[_key];var b=function b(){_classCallCheck(this,b)},c=b.prototype;return a.map(function(_ref){var d=_ref.prototype;Object.getOwnPropertyNames(d).map(function(e){var f=c[e]||function(){};c[e]=function(){return f.apply(null,[].slice.call(arguments)),d[e].apply(null,[].slice.call(arguments))}})}),b};module.exports=mixin;
});
___scope___.file("model.js", function(exports, require, module, __filename, __dirname){ 

'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&'function'==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?'symbol':typeof obj},model={is:function is(b,c){return b&&b.isValid instanceof Function?b.isValid(c):b===String&&(c instanceof String||'string'==typeof c)||b===Number&&(c instanceof Number||'number'==typeof c)||b===Boolean&&(c instanceof Boolean||'boolean'==typeof c)||b===Function&&(c instanceof Function||'function'==typeof c)||b===Object&&(c instanceof Object||'object'==('undefined'==typeof c?'undefined':_typeof(c)))||void 0===b},check:function check(b,c,d){return Object.keys(b).forEach(function(e){var f=b[e],g=d[e];if(c[e]||void 0!==g){f instanceof Array||(f=[f]);var h=f.reduce(function(j,k){return j||MODEL.is(k,g)},!1);if(!h)throw'{'+e+': '+JSON.stringify(g)+'} is not one of '+f.map(function(j){return'\n - '+j})}}),!0},init:function init(){var c=void 0,d=void 0,e=void 0;for(var _len=arguments.length,b=Array(_len),_key=0;_key<_len;_key++)b[_key]=arguments[_key];b.map(function(g){g instanceof Function&&!e?e=g:'object'==('undefined'==typeof g?'undefined':_typeof(g))&&(c?!d&&(d=g):c=g)});var f=function f(g){var h=e?[check,e]:[check];return h.reduce(function(j,k){return j&&k(c||{},d||{},g)},!0)};return{isValid:f,whenValid:function whenValid(g){return new Promise(function(h){return f(g)&&h(g)})}}},ArrayOf:function ArrayOf(b){return MODEL.init(function(c,d,e){if(!(e instanceof Array))throw e+' not an Array';return e.map(function(f){if(!MODEL.is(b,f))throw f+' is not a model instance'}),!0})}};// Validate JS objects for their "shape"
exports.default=model;/**
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
});
___scope___.file("observable.js", function(exports, require, module, __filename, __dirname){ 

"use strict";Object.defineProperty(exports,"__esModule",{value:!0});// async-supporting-observables
var obs=function obs(a){var b=[],c=function c(g){if(void 0!==g){a=g;for(var h=0,j=b.length;h<j;h++)b[h](g)}return a};return c.map=function(g){var h=obs();return b.push(function(j){return h(g(j))}),h},c.filter=function(g){var h=obs();return b.push(function(j){return g(j)&&h(j)}),h},c.then=function(g){return b.push(function(h){return g(h)}),c},c.take=function(g){var h=[],j=obs(),k=function k(l){if(h.length<g&&h.push(l),h.length===g)return b.delete(k),j(h)};return b.push(k),j},c.takeWhile=function(g){var h=[],j=obs(),k=function k(l){return g(l)?void h.push(l):(b=b.filter(function(m){return m!==k}),j(h))};return b.push(k),j},c.reduce=function(g,h){var j=obs();return b.push(function(k){h=g(h,k),j(h)}),j},c.maybe=function(g){var h=obs(),j=obs();return b.push(function(k){return g(k).then(function(l){return h(l)}).catch(function(l){return j(l)})}),[h,j]},c.stop=function(){return b=[]},c.debounce=function(g){var h=obs(),j=+new Date;return b.push(function(k){var l=+new Date;l-j>=g&&(j=+new Date,h(k))}),h},c};obs.from=function(a){var b=obs();return a(function(c){return b(c)}),b},obs.union=function(){for(var _len=arguments.length,a=Array(_len),_key=0;_key<_len;_key++)a[_key]=arguments[_key];var b=obs();return a.map(function(c){return c.then(b)}),b};exports.default=obs;
});
___scope___.file("hamt.js", function(exports, require, module, __filename, __dirname){ 

'use strict';Object.defineProperty(exports,'__esModule',{value:!0});// compute the hamming weight
var hamming=exports.hamming=function hamming(e){return e-=1431655765&e>>1,e=(858993459&e)+(858993459&e>>2),e=252645135&e+(e>>4),e>>=8,e>>=16,127&e};var popcount=exports.popcount=function popcount(e){if(e.key)return 1;var f=e.children;if(f){var g=0;for(var l in f)g+=popcount(f[l]);return g}};// hash fn
var hash=exports.hash=function hash(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:'';e=JSON.stringify(e);var f=5381;for(var g=0;g<e.length;g++)f=(f<<5)+f+e.charCodeAt(g);return f};// compare two hashes
var comp=exports.comp=function comp(e,f){return hash(e)===hash(f)};// get a bit vector
var HMAP_SIZE=exports.HMAP_SIZE=8;var MAX_DEPTH=exports.MAX_DEPTH=32/HMAP_SIZE-1;var vec=exports.vec=function vec(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,f=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,g=2<arguments.length&&void 0!==arguments[2]?arguments[2]:HMAP_SIZE;return e>>>g*f&(1<<g)-1};var shallowClone=exports.shallowClone=function shallowClone(e){var f=Object.create(null);for(var g in e)f[g]=e[g];return f};var cloneNode=exports.cloneNode=function cloneNode(e){var f=node();return e?(e.children?f.children=shallowClone(e.children):void 0!==e.key&&(f.key=e.key,f.val=e.val,f.hash=e.hash),f):f};var numChildren=exports.numChildren=function numChildren(e){var f=0;for(var g in e)++f;return f};var set=exports.set=function set(e,f,g){if(e.key===void 0&&!e.children)return node(f,g);var l=cloneNode(e),m=hash(f);// walk the tree
for(var o=3,q=e,s=l;0<=o;--o){var t=vec(m,o);if(q.key!==void 0){// if we have a collision
if(q.key===f||0===o)s.val=g;else if(0!==o){// else if r is not at max depth and keys don't match
// add levels to both trees, new tree must be able
// to access old data
// 0. create makeshift value node for r
// and new value node for n
var u=node(q.key,q.val,q.hash),w=node(f,g,m),z=q.hash;// 1. delete value props from nodes
delete q.key,delete q.val,delete q.hash,delete s.key,delete s.val,delete s.hash;// 2. create layers until bit-vectors don't collide
for(var A=o,B=q,C=s;0<=A;A--){var D=vec(z,A),E=vec(m,A),F=B.children=Object.create(null),G=C.children=shallowClone(F);// create new layer for c and r
if(D!==E){F[D]=u,G[D]=u,G[E]=w;break}else B=F[D]=node(),C=G[E]=cloneNode(B)}}break}else if(q.children){var _u=q.children[t];if(!_u){s=s.children[t]=node(f,g);break}else q=_u,s=s.children[t]=cloneNode(q)}}return l};var get=exports.get=function get(e,f){if(e.key===f)return e.val;var g=hash(f);for(var l=3,m=e;0<=l;--l){if(!m.children)return;if(m=m.children[vec(g,l)],!m)return;if(void 0!==m.key)return m.val}return};var first=exports.first=function first(e){var f=e.children;for(var g in f)return f[g]};var unset=exports.unset=function unset(e,f){var g=cloneNode(e),l=hash(f);for(var m=3,o=g;-1<=m;--m){if(o.key)return delete o.key,delete o.val,delete o.hash,g;//             let c = numChildren(p)
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
var q=vec(l,m);if(o=o&&o.children&&o.children[q],!o)return g}return g};var node=exports.node=function node(e,f){var g=2<arguments.length&&void 0!==arguments[2]?arguments[2]:void 0!==e&&hash(e),l=Object.create(null);/*
    potential props of a tree node
    - key - hashkey
    - val - value
    - children - { ... } -> points to other nodes (List<Node> children)
    */return void 0!==e&&(l.key=e,l.hash=g,l.val=f),l};var map=exports.map=function map(e,f){if(e.key!==void 0)return node(e.key,f(e.val,e.key),e.hash);var g=cloneNode(e),l=g.children;if(l)for(var m in l)l[m]=map(l[m],f);return g};var filter=exports.filter=function filter(e,f){if(e.key!==void 0)return f(e.val,e.key)?e:void 0;var g=cloneNode(e),l=g.children;if(l)for(var m in l)filter(l[m],f)||delete l[m];return g};var reduce=exports.reduce=function reduce(e,f,g){if(e.key!==void 0)return f(g,e.val,e.key);var l=e.children;if(l){for(var m in l)g=reduce(l[m],f,g);return g}};var toList=exports.toList=function toList(e){var f=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[];e.key!==void 0&&f.push(e.val);var g=e.children;if(g)for(var l in g)toList(g[l],f);return f};var toOrderedList=exports.toOrderedList=function toOrderedList(e){var f=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[],g=0,l=void 0;do l=get(e,g++),void 0!=l&&f.push(l);while(l);return f};var toJSON=exports.toJSON=function toJSON(e){var f=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};e.key!==void 0&&(f[e.key]=e.val);var g=e.children;if(g)for(var l in g)toJson(g[l],f);return f};var push=exports.push=function push(e,f){return set(e,popcount(e),f)};var pop=exports.pop=function pop(e){return unset(e,popcount(e)-1)};var shift=exports.shift=function shift(e){return reduce(unset(e,0),function(f,g,l){return set(f,l-1,g)},node())};var unshift=exports.unshift=function unshift(e,f){return set(reduce(e,function(g,l,m){return set(g,m+1,l)},node()),0,f)};var hamt=exports.hamt=node;// console.clear()
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
});
___scope___.file("worker.js", function(exports, require, module, __filename, __dirname){ 

'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var supports=function supports(){for(var _len=arguments.length,a=Array(_len),_key=0;_key<_len;_key++)a[_key]=arguments[_key];return function(){return a.reduce(function(b,d){return b||window[d]!==void 0&&/[native code]/.test(window[d]+'')&&window[d]},!1)}},supportsWorkers=supports('Worker'),supportsBlobs=supports('Blob'),supportsURLs=supports('URL','webkitURL'),supportsBuilders=supports('BlobBuilder','WebKitBlobBuilder','MozBlobBuilder');/*
worker:: [X] -> Worker where X : Function | String

the last X provided in the arguments will be setup as the handler for self.onmessage()
*/var worker=exports.worker=function worker(){for(var _len2=arguments.length,a=Array(_len2),_key2=0;_key2<_len2;_key2++)a[_key2]=arguments[_key2];if(!supportsWorkers())throw'WebWorkers not supported';a[a.length-1]='self.onmessage='+a[a.length-1];var b=supportsBlobs(),d=supportsBuilders(),f=supportsURLs(),g=void 0;supportsBlobs()?g=new b(a.map(function(i){return i+''}),{type:'application/javascript'}):d?(g=new d,a.map(function(i){return g.append(i+'')}),g=g.getBlob()):g='data:application/javascript,'+(''+encodeURIComponent(a.reduce(function(i,j){return i+j},'')));var h=f.createObjectURL(g);return new Worker(h)};var farm=exports.farm=function farm(a){for(var _len3=arguments.length,b=Array(1<_len3?_len3-1:0),_key3=1;_key3<_len3;_key3++)b[_key3-1]=arguments[_key3];var d=Array(a).fill(1).map(function(){return worker.apply(void 0,b)}),f=0,g=function g(){return++f>=a&&(f=0),f},h=void 0,i=void 0;d.map(function(k){k.onmessage=function(l){return h instanceof Function&&h(l.data)},k.onerror=function(l){return i instanceof Function&&i(l)}});var j=function j(){for(var _len4=arguments.length,k=Array(_len4),_key4=0;_key4<_len4;_key4++)k[_key4]=arguments[_key4];var l=d[g()];l&&l.postMessage(k)};return j.pipe=function(k){return h=k,j},j.error=function(k){return i=k,j},j};
});
___scope___.file("fp.js", function(exports, require, module, __filename, __dirname){ 
var process = require("process");
'use strict';Object.defineProperty(exports,'__esModule',{value:!0});function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++)arr2[i]=arr[i];return arr2}return Array.from(arr)}var log=exports.log=function log(){var _console;return(_console=console).log.apply(_console,arguments)};// rAF
var rAF=exports.rAF='undefined'!=typeof document&&(requestAnimationFrame||webkitRequestAnimationFrame||mozRequestAnimationFrame)||process&&process.nextTick||function(b){return setTimeout(b,16.6)};// composition
// c :: (T -> U) -> (U -> V) -> (T -> V)
var c=exports.c=function c(b,d){return function(e){return b(d(e))}};// cof :: [(an -> bn)] -> a0 -> bn
// compose forward
var cof=exports.cof=function cof(){for(var _len=arguments.length,b=Array(_len),_key=0;_key<_len;_key++)b[_key]=arguments[_key];return b.reduce(function(d,e){return c(d,e)})};// cob :: [(an -> bn)] -> b0 -> an
// compose backwards
var cob=exports.cob=function cob(){for(var _len2=arguments.length,b=Array(_len2),_key2=0;_key2<_len2;_key2++)b[_key2]=arguments[_key2];return cof.apply(void 0,_toConsumableArray(b.reverse()))};// functional utilities
// pointfree
var pf=exports.pf=function pf(b){return function(){for(var _len3=arguments.length,d=Array(_len3),_key3=0;_key3<_len3;_key3++)d[_key3]=arguments[_key3];return function(e){return b.apply(e,d)}}};// curry
// curry :: (T -> U) -> [args] -> ( -> U)
var curry=exports.curry=function curry(b){for(var _len4=arguments.length,d=Array(1<_len4?_len4-1:0),_key4=1;_key4<_len4;_key4++)d[_key4-1]=arguments[_key4];return b.bind.apply(b,[void 0].concat(d))};// Transducers
var mapping=exports.mapping=function mapping(b){return(// mapper: x -> y
function(d){return(// reducer: (state, value) -> new state
function(e,h){return d(e,b(h))})})};var filtering=exports.filtering=function filtering(b){return(// predicate: x -> true/false
function(d){return(// reducer: (state, value) -> new state
function(e,h){return b(h)?d(e,h):e})})};var concatter=exports.concatter=function concatter(b,d){return b.concat([d])};
});
});
FuseBox.expose([{"alias":"clan-fp","pkg":"default"}]);
})
(function(e){var r="undefined"!=typeof window&&window.navigator;r&&(window.global=window),e=r&&"undefined"==typeof __fbx__dnm__?e:module.exports;var t=r?window.__fsbx__=window.__fsbx__||{}:global.$fsbx=global.$fsbx||{};r||(global.require=require);var n=t.p=t.p||{},i=t.e=t.e||{},o=function(e){if(/^([@a-z].*)$/.test(e)){if("@"===e[0]){var r=e.split("/"),t=r.splice(2,r.length).join("/");return[r[0]+"/"+r[1],t||void 0]}return e.split(/\/(.+)?/)}},a=function(e){return e.substring(0,e.lastIndexOf("/"))||"./"},f=function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var t=[],n=0,i=arguments.length;n<i;n++)t=t.concat(arguments[n].split("/"));for(var o=[],n=0,i=t.length;n<i;n++){var a=t[n];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===t[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")},u=function(e){var r=e.match(/\.(\w{1,})$/);if(r){var t=r[1];return t?e:e+".js"}return e+".js"},s=function(e){if(r){var t,n=document,i=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(t=n.createElement("link"),t.rel="stylesheet",t.type="text/css",t.href=e):(t=n.createElement("script"),t.type="text/javascript",t.src=e,t.async=!0),i.insertBefore(t,i.firstChild)}},l=function(e,t){var i=t.path||"./",a=t.pkg||"default",s=o(e);s&&(i="./",a=s[0],t.v&&t.v[a]&&(a=a+"@"+t.v[a]),e=s[1]),/^~/.test(e)&&(e=e.slice(2,e.length),i="./");var l=n[a];if(!l){if(r)throw'Package was not found "'+a+'"';return{serverReference:require(a)}}e||(e="./"+l.s.entry);var c,v=f(i,e),p=u(v),d=l.f[p];return!d&&/\*/.test(p)&&(c=p),d||c||(p=f(v,"/","index.js"),d=l.f[p],d||(p=v+".js",d=l.f[p]),d||(d=l.f[v+".jsx"])),{file:d,wildcard:c,pkgName:a,versions:l.v,filePath:v,validPath:p}},c=function(e,t){if(!r)return t(/\.(js|json)$/.test(e)?global.require(e):"");var n;n=new XMLHttpRequest,n.onreadystatechange=function(){if(4==n.readyState&&200==n.status){var r=n.getResponseHeader("Content-Type"),i=n.responseText;/json/.test(r)?i="module.exports = "+i:/javascript/.test(r)||(i="module.exports = "+JSON.stringify(i));var o=f("./",e);d.dynamic(o,i),t(d.import(e,{}))}},n.open("GET",e,!0),n.send()},v=function(e,r){var t=i[e];if(t)for(var n in t){var o=t[n].apply(null,r);if(o===!1)return!1}},p=function(e,t){if(void 0===t&&(t={}),/^(http(s)?:|\/\/)/.test(e))return s(e);var i=l(e,t);if(i.serverReference)return i.serverReference;var o=i.file;if(i.wildcard){var f=new RegExp(i.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@/g,"[a-z0-9$_-]+")),u=n[i.pkgName];if(u){var d={};for(var g in u.f)f.test(g)&&(d[g]=p(i.pkgName+"/"+g));return d}}if(!o){var m="function"==typeof t,_=v("async",[e,t]);if(_===!1)return;return c(e,function(e){if(m)return t(e)})}var h=i.validPath,x=i.pkgName;if(o.locals&&o.locals.module)return o.locals.module.exports;var w=o.locals={},b=a(h);w.exports={},w.module={exports:w.exports},w.require=function(e,r){return p(e,{pkg:x,path:b,v:i.versions})},w.require.main={filename:r?"./":global.require.main.filename};var y=[w.module.exports,w.require,w.module,h,b,x];return v("before-import",y),o.fn.apply(0,y),v("after-import",y),w.module.exports},d=function(){function t(){}return Object.defineProperty(t,"isBrowser",{get:function(){return void 0!==r},enumerable:!0,configurable:!0}),Object.defineProperty(t,"isServer",{get:function(){return!r},enumerable:!0,configurable:!0}),t.global=function(e,t){var n=r?window:global;return void 0===t?n[e]:void(n[e]=t)},t.import=function(e,r){return p(e,r)},t.on=function(e,r){i[e]=i[e]||[],i[e].push(r)},t.exists=function(e){var r=l(e,{});return void 0!==r.file},t.remove=function(e){var r=l(e,{}),t=n[r.pkgName];t&&t.f[r.validPath]&&delete t.f[r.validPath]},t.main=function(e){return t.import(e,{})},t.expose=function(r){for(var t in r){var n=r[t],i=p(n.pkg);e[n.alias]=i}},t.dynamic=function(r,t){this.pkg("default",{},function(n){n.file(r,function(r,n,i,o,a){var f=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",t);f(!0,r,n,i,o,a,e)})})},t.pkg=function(e,r,t){if(n[e])return t(n[e].s);var i=n[e]={},o=i.f={};i.v=r;var a=i.s={file:function(e,r){o[e]={fn:r}}};return t(a)},t}();return e.FuseBox=d}(this))
//# sourceMappingURL=index.js.map