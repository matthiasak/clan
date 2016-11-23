webpackHotUpdateclan(0,{

/***/ "./src/hamt.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};// compute the hamming weight
const hamweight=x=>{x-=x>>1&0x55555555;x=(x&0x33333333)+(x>>2&0x33333333);x=x+(x>>4)&0x0f0f0f0f;x+=x>>8;x+=x>>16;return x&0x7f;};// hash fn
const hash=(v='')=>{v=JSON.stringify(v);var hash=5381;for(let i=0;i<v.length;i++)hash=(hash<<5)+hash+v.charCodeAt(i);return hash;};
/* harmony export (immutable) */ exports["hash"] = hash;
// compare two hashes
const comp=(a,b)=>{return hash(a)===hash(b);};
/* harmony export (immutable) */ exports["comp"] = comp;
// get a sub bit vector
const frag=(h=0,i=0,range=8)=>{return h>>>range*i&(1<<range)-1;};// clone a node
const branch=(root,h,delta=0)=>{let n=node(),// new root
_n=n;n.keys=root.keys?Array.from(root.keys):[];for(let x=0,_o=root;x<4-delta;x++){let __n=node(),// create new child node
f=frag(h,x);// get bitmask
if(_o){for(let i in _o)// point new parent node to existing sub-nodes
x!==4&&i!==f&&(_n[i]=_o[i]);}_n[f]=__n;// set new node's address
_n=__n;// go down the clone tree
_o&&(_o=_o[f]);// go down the original tree
}return[n,_n];// return the lowest node that should hold the value
};const set=(root,key,val)=>{let[parent,child]=branch(root,hash(key));child.val=val;child.key=key;const index=parent.keys.indexOf(key);parent.keys.splice(index===-1?0:index,index===-1?0:1,key);return parent;};
/* harmony export (immutable) */ exports["set"] = set;
const unset=(root,key)=>{let h=hash(key),[parent,child]=branch(root,h,-1);delete child[frag(h,3)];const index=parent.keys.indexOf(key);parent.keys.splice(index===-1?0:index,index===-1?0:1);return parent;};
/* harmony export (immutable) */ exports["unset"] = unset;
const get=(root,key)=>{let h=hash(key),r=root;console.log(r);for(let i=0;i<4;i++){r=r[frag(h,i)];}return r?r.val:undefined;};
/* harmony export (immutable) */ exports["get"] = get;
const map=(root,fn)=>{let v=root.keys,result=root;if(v){for(var i=0,len=v.length;i<len;i++){const key=v[i],val=get(root,key);result=set(result,key,fn(val,key));// maybe some sort of setMutable?
}}return result;};
/* harmony export (immutable) */ exports["map"] = map;
const reduce=(root,fn,acc)=>{const v=root.keys;if(v){for(var i=0,len=v.length;i<len;i++){const key=v[i],val=get(root,key);acc=fn(acc,val,key);}}return acc;};
/* harmony export (immutable) */ exports["reduce"] = reduce;
const filter=(root,fn)=>{const v=root.keys,result=root;if(v){for(var i=0,len=v.length;i<len;i++){const key=v[i],val=get(result,key);if(!fn(val,key)){result=unset(result,key);}}}return result;};
/* harmony export (immutable) */ exports["filter"] = filter;
const push=(root,val)=>{const length=root.keys&&root.keys.length||0;return set(root,length,val);};
/* harmony export (immutable) */ exports["push"] = push;
const pop=root=>{const length=root.keys&&root.keys.length||0;return unset(root,length-1);};
/* harmony export (immutable) */ exports["pop"] = pop;
const toList=root=>{return reduce(root,(acc,v,k)=>{return acc.concat(v);},[]);};
/* harmony export (immutable) */ exports["toList"] = toList;
const toJSON=root=>{return reduce(root,(acc,value,key)=>{return _extends({[key]:value},acc);},{});};
/* harmony export (immutable) */ exports["toJSON"] = toJSON;
const node=(val=undefined)=>{let result=Object.create(null);if(val)result.val=val;// result.keys = []
return result;};const hamt=m=>{let root=node();if(m instanceof Array){for(let i=0,len=m.length;i<len;i++)root=set(root,i,m[i]);}else if(m instanceof Object){for(let i in m)m.hasOwnProperty(i)&&(root=set(i,m[i]));}return root;};
/* harmony export (immutable) */ exports["hamt"] = hamt;


/***/ }

})
//# sourceMappingURL=index.js.map