// compute the hamming weight
const hamming = x => {
    x -= ((x >> 1) & 0x55555555)
    x = (x & 0x33333333) + ((x >> 2) & 0x33333333)
    x = (x + (x >> 4)) & 0x0f0f0f0f
    x += (x >> 8)
    x += (x >> 16)
    return (x & 0x7f)
}

const popcount = root => {
    if(root.key)
        return 1

    let c = root.children
    if(c) {
        var sum = 0
        for(var i in c) sum += popcount(c[i])
        return sum
    }
}

// hash fn
const hash = (v='') => {
    v = JSON.stringify(v)
    var hash = 5381
    for (let i = 0; i < v.length; i++)
        hash = ((hash << 5) + hash) + v.charCodeAt(i)
    return hash
}

// compare two hashes
const comp = (a,b) => hash(a) === hash(b)

// get a bit vector
const HMAP_SIZE = 8
const MAX_DEPTH = 32 / HMAP_SIZE - 1
const vec = (h=0, i=0, range=HMAP_SIZE) => (h >>> (range*i)) & ((1 << range) - 1)

const shallowClone = x => {
    let y = Object.create(null)
    for(let i in x)
        y[i] = x[i]
    return y
}

const cloneNode = x => {
    let y = node()
    if(!x) return y

    if(x.children) {
        y.children = shallowClone(x.children)
    } else if(x.key !== undefined) {
        y.key = x.key
        y.val = x.val
        y.hash = x.hash
    }

    return y
}

const numChildren = x => {
    let c = 0
    for(var i in x) ++c
    return c
}

const set = (root, key, val) => {
    if((root.key === undefined) && !root.children) return node(key, val)

    const newroot = cloneNode(root), h = hash(key)

    // walk the tree
    for(var i = 3, r = root, n = newroot; i >= 0; --i){
        let bits = vec(h, i)

        if(r.key !== undefined){
            // if we have a collision
            if(r.key === key || i === 0) {
                // if keys match or is leaf, just overwrite n's val
                n.val = val
            } else if(i !== 0) {
                // else if r is not at max depth and keys don't match
                // add levels to both trees, new tree must be able
                // to access old data

                // 0. create makeshift value node for r
                // and new value node for n
                let cp = node(r.key, r.val, r.hash)
                let cn = node(key, val, h)
                let rh = r.hash

                // 1. delete value props from nodes
                delete r.key
                delete r.val
                delete r.hash
                delete n.key
                delete n.val
                delete n.hash

                // 2. create layers until bit-vectors don't collide
                for(let j = i, __r = r, __n = n; j >= 0; j--){
                    let vecr = vec(rh, j),
                        vecn = vec(h, j)

                    // create new layer for c and r
                    let c = __r.children = Object.create(null)
                    let d = __n.children = shallowClone(c)

                    if(vecr !== vecn) {
                        c[vecr] = cp
                        d[vecr] = cp
                        d[vecn] = cn
                        break
                    } else {
                        __r = c[vecr] = node()
                        __n = d[vecn] = cloneNode(__r)
                    }
                }
            }
            break
        } else if(r.children) {
            let _r = r.children[bits]
            if(!_r) {
                n = n.children[bits] = node(key, val)
                break
            } else {
                r = _r
                n = n.children[bits] = cloneNode(r)
            }
        }
    }

    return newroot
}

const get = (root, key) => {
    if(root.key === key) return root.val
    const h = hash(key)
    for(let i = 3, r = root; i >= 0; --i){
        if(!r.children) return undefined
        r = r.children[vec(h, i)]
        if(!r) return undefined
        if(r.key !== undefined) return r.val
    }

    return undefined
}

const first = root => {
    let c = root.children
    for(let i in c) return c[i]
}

const unset = (root, key) => {
    const n = cloneNode(root),
          h = hash(key)

    for(var i = 3, _n = n, p = n; i >= -1; --i) {
        if(_n.key) {
            delete _n.key
            delete _n.val
            delete _n.hash
            return n

//             let c = numChildren(p)

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
        }

        const bits = vec(h, i)
        _n = _n && _n.children && _n.children[bits]
        if(!_n) return n
        p = _n
    }
    return n
}

const node = (key,val,h= key !== undefined && hash(key)) => {
    /*
    potential props of a tree node
    - key - hashkey
    - val - value
    - children - { ... } -> points to other nodes (List<Node> children)
    */

    let item = Object.create(null)
    if(key !== undefined){
        item.key = key
        item.hash = h
        item.val = val
    }
    return item
}

const map = (root, fn) => {
    if(root.key !== undefined)
        return node(root.key, fn(root.val, root.key), root.hash)

    let d = cloneNode(root),
        c = d.children

    if(c) {
        for(var i in c){
            c[i] = map(c[i], fn)
        }
    }

    return d
}

const filter = (root, fn) => {
    if(root.key !== undefined)
        return fn(root.val, root.key) ? root : undefined

    let d = cloneNode(root),
        c = d.children

    if(c) {
        for(var i in c){
            if(!filter(c[i], fn))
                delete c[i]
        }
    }

    return d
}

const reduce = (root, fn, acc) => {
    if(root.key !== undefined)
        return fn(acc, root.val, root.key)

    let c = root.children
    if(c) {
        for(var i in c)
            acc = reduce(c[i], fn, acc)

        return acc
    }
}

const toList = (root, r=[]) => {
    if(root.key !== undefined) r.push(root.val)

    let c = root.children
    if(c) {
        for(var i in c) {
            toList(c[i], r)
        }
    }

    return r
}

const toOrderedList = (root, r=[]) => {
    let i = 0,
        n

    do {
        n = get(root, i++)
        n !== undefined && r.push(n)
    } while(n)

    return r
}

const toJSON = (root, r={}) => {
    if(root.key !== undefined)
        r[root.key] = root.val

    let c = root.children
    if(c) {
        for(var i in c) {
            toJson(c[i], r)
        }
    }

    return r
}

const push = (root, val) => set(root, popcount(root), val)

const pop = root => unset(root, popcount(root)-1)

const shift = root => reduce(
    unset(root, 0),
    (acc,v,k) => set(acc, k-1, v),
    node())

const unshift = (root, val) =>
    set(
        reduce(
            root,
            (acc,v,k) => set(acc, k+1, v),
            node()),
        0,
        val)

const hamt = node

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