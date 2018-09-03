// types

interface G {
    document: Object
    webkitRequestAnimationFrame: Function
    mozRequestAnimationFrame: Function
    requestAnimationFrame: Function
}
declare var global : G;

// code

export const rAF =
      !!global.document &&
      (global.requestAnimationFrame ||
      global.webkitRequestAnimationFrame ||
      global.mozRequestAnimationFrame) ||
      (cb => setTimeout(cb, 16.6))

export const hash = (v) => {
    if(v === null || v === undefined || typeof v !== 'object') return v
    let keys = Object.keys(v)
    keys.sort()
    let keyOrderedHash = keys.reduce((acc,key) => {
      acc[key] = v[key]
      return acc
    }, {})
    let hash = 0, _v = JSON.stringify(keyOrderedHash)
    for (let i = 0, len = _v.length; i < len; ++i) {
        const c = _v.charCodeAt(i)
        hash = (((hash << 5) - hash) + c) | 0
    }
    return hash
}

// Transducers
export const mapping = (mapper) => // mapper: x -> y
    (reducer) => // reducer: (state, value) -> new state
        (result, value) =>
            reducer(result, mapper(value))

export const filtering = (predicate) => // predicate: x -> true/false
    (reducer) => // reducer: (state, value) -> new state
        (result, value) =>
            predicate(value) ? reducer(result, value) : result