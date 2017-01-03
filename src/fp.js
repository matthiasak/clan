export const log = (...a) => console.log(...a)

// rAF
export const rAF =
      !!global.document &&
      (global.requestAnimationFrame ||
      global.webkitRequestAnimationFrame ||
      global.mozRequestAnimationFrame) ||
      (cb => setTimeout(cb, 16.6))

// composition
// c :: (T -> U) -> (U -> V) -> (T -> V)
export const c = (f,g) => x => f(g(x))

// cof :: [(an -> bn)] -> a0 -> bn
// compose forward
export const cof = (...fns) => fns.reduce((acc,fn) => c(acc, fn))

// cob :: [(an -> bn)] -> b0 -> an
// compose backwards
export const cob = (...fns) => cof(...fns.reverse())

// functional utilities
// pointfree
export const pf = fn => (...args) => x => fn.apply(x, args)

// curry
// curry :: (T -> U) -> [args] -> ( -> U)
export const curry = (fn, ...args) =>
	fn.bind(undefined, ...args)


// Transducers
export const mapping = (mapper) => // mapper: x -> y
    (reducer) => // reducer: (state, value) -> new state
        (result, value) =>
            reducer(result, mapper(value))

export const filtering = (predicate) => // predicate: x -> true/false
    (reducer) => // reducer: (state, value) -> new state
        (result, value) =>
            predicate(value) ? reducer(result, value) : result

export const concatter = (thing, value) =>
    thing.concat([value])
