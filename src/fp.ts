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

export const hash = (v,_v= v === undefined ? 'undefined' : JSON.stringify(v)) => {
    let hash = 0
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