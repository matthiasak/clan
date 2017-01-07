
const mixin = (...classes) => {
    class _mixin {}

    let proto = _mixin.prototype

    classes.map(({prototype:p}) => {
        Object.getOwnPropertyNames(p).map(key => {
            let oldFn = proto[key] || ($ => {})
            proto[key] = function() {
                oldFn.apply(null, [].slice.call(arguments))
                return p[key].apply(null, [].slice.call(arguments))
            }
        })
    })

    return _mixin
}

module.exports = mixin