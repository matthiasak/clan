// HAMT
const HAMT = {
    node(val=undefined) {
        let result = {}
        if(val) result.val = val
        return result
    },

    // compute the hamming weight
    hamweight(x) {
        x -= ((x >> 1) & 0x55555555)
        x = (x & 0x33333333) + ((x >> 2) & 0x33333333)
        x = (x + (x >> 4)) & 0x0f0f0f0f
        x += (x >> 8)
        x += (x >> 16)
        return (x & 0x7f)
    },

    // hash fn
    hash(str) {
        if(typeof str !== 'string') str = JSON.stringify(str)
        const type = typeof str
        if (type === 'number') return str
        if (type !== 'string') str += ''

        let hash = 0
        for (let i = 0, len = str.length; i < len; ++i) {
            const c = str.charCodeAt(i)
            hash = (((hash << 5) - hash) + c) | 0
        }
        return hash
    },

    // compare two hashes
    comp(a,b){ return this.hash(a) === this.hash(b) },

    // get a sub bit vector
    frag(h=0, i=0, range=8){
        return (h >>> (range*i)) & ((1 << range) - 1)
    },

    // clone a node
    replicate(h) {
        let n = this.node()
        for(var x=0, _o=this.root, _n=n; x < 4; x++){
            for(let i in _o){
                if(i !== 'val' && _o.hasOwnProperty(i)){
                    _n[i] = _o[i]
                }
            }

            let __n = this.node(),
                f = this.frag(h, x)

            _n[f] = __n
            _n = __n
            _o = _o[f] === undefined ? {} : _o[f]
        }
        return n
    },

    set(key, val) {
        let h = this.hash(key),
            n = this.get(key)
		
        if((n === undefined) || !this.comp(n, val)){
            let r = this.replicate(h)
            
            for(var i=0, _r=r; i<4; i++)
                _r = _r[this.frag(h,i)]
                
            _r.val = val
            const d = hamt()
            d.keys = this.cloneKeys()
            d.keys.add(key)
            d.root = r
            return d
        }

        return this
    },

	unset(key) {
        let h = this.hash(key),
            r = this.replicate(h),
            m = hamt()
        
        for(var i=0, _r=r; i<3; i++) 
            _r = _r[this.frag(h,i)]
            
        _r[this.frag(h,3)] = undefined
        
        m.root = r
        m.keys = this.cloneKeys()
        m.keys.delete(key)
        
        return r
    },

    get(key) {
        let h = this.hash(key)
        for(var i = 0, _r = this.root; i < 4; i++){
            _r = _r[this.frag(h,i)]
            if(!_r) return undefined
        }
        return _r.val
    },

    map(fn) {
        let items = this.getKeys(),
            result = hamt()

        for(let i=0,len=items.length; i<len; i++)
            result.set(
                items[i],
                fn(this.get(items[i]))
            )

        return result
    },

    reduce(fn, acc) {
        let items = this.getKeys()
        
        acc = (acc === undefined) ? items.shift() : acc
        
        for(let i=0,len=items.length;i<len;i++) 
            acc = fn(acc, this.get(items[i]), items[i])
            
        return acc
    },
    
    toJSON(){
        return this.reduce((acc, value, key) => 
				({[key]: value,...acc}), {})
    },
    
    getKeys() { return Array.from(this.keys) },
    
    cloneKeys() { return new Set(this.getKeys()) },

    init(m) {
        this.root = this.node()
        if(m instanceof Array){
            for(let i = 0, len = m.length; i < len; i++)
                this.root = this.set(i, m[i]).root
        } else if(m instanceof Object){
            for(let i in m)
                m.hasOwnProperty(i) && (this.root = this.set(i, m[i]).root)
        }
        return this.root
    }
}

export function hamt(initial={}) {
    if(!this) return new hamt(initial)
    this.keys = new Set
    this.root = HAMT.init(initial)
}
hamt.prototype = HAMT
