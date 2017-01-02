import batch from './batch'
import vdom from './vdom'
import mixin from './mixin'
import model from './model'
import obs from './observable'
import * as hamt from './hamt'
import * as worker from './worker'
import * as fp from './fp'

export const hash = (v,_v=JSON.stringify(v)) => {
    let hash = 0
    for (let i = 0, len = _v.length; i < len; ++i) {
        const c = _v.charCodeAt(i)
        hash = (((hash << 5) - hash) + c) | 0
    }
    return hash
}

module.exports = Object.assign({}, fp, {
	batch
	, vdom
	, mixin
	, model
	, obs
	, hamt
	, worker
})
