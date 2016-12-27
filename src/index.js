export batch from './batch'
export vdom from './vdom'
export mixin from './mixin'
export model from './model'
export obs from './observable'
export * as hamt from './hamt'
export * as worker from './worker'
export * from './fp'
export const hash = (v,_v=JSON.stringify(v)) => {
    let hash = 0
    for (let i = 0, len = _v.length; i < len; ++i) {
        const c = _v.charCodeAt(i)
        hash = (((hash << 5) - hash) + c) | 0
    }
    return hash
}