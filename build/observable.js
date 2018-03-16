"use strict";
exports.__esModule = true;
// import {hash} from './fp'
var hash = function (v, _v) {
    if (_v === void 0) { _v = v === undefined ? 'undefined' : JSON.stringify(v); }
    return _v;
};
var obs = (function (state) {
    var subscribers = [];
    var fn = (function (val) {
        if (val !== undefined) {
            state = val(subscribers || [])
                .map(function (s) {
                return (s instanceof Function) && s(val);
            });
        }
        return state;
    });
    var createDetachable = function (x) {
        if (x === void 0) { x = obs(); }
        x.detach = function ($) {
            var i = subscribers.indexOf(obs);
            if (i !== -1) {
                subscribers.splice(i, 1);
                // subscribers.length === 0 && (fn.detach instanceof Function) && fn.detach()
            }
        };
        x.reattach = function ($) { return subscribers.push(obs); };
        x.parent = fn;
        return x;
    };
    fn.computed = function () {
        var sink = createDetachable();
        var prev = state;
        fn.then(function (x) {
            if (hash(prev) === hash(x))
                return;
            prev = x;
            sink(x);
        });
        return sink;
    };
    fn.refresh = function () { return fn(fn()); };
    fn.map = function (f) {
        var o = createDetachable();
        subscribers.push(function (val) { return o(f(val)); });
        return o;
    };
    fn.filter = function (f) {
        var o = createDetachable();
        subscribers.push(function (val) { return f(val) && o(val); });
        return o;
    };
    fn.then = function (f) {
        subscribers.push(function (val) { return f(val); });
        return fn;
    };
    fn.take = function (n) {
        var count = 0, o = createDetachable();
        var cb = function (val) {
            if (count <= n) {
                count++;
                o(val);
            }
            if (count === n)
                subscribers = subscribers.filter(function (x) { return x !== cb; });
        };
        subscribers.push(cb);
        return o;
    };
    fn.takeWhile = function (f) {
        var o = createDetachable();
        var cb = function (val) {
            if (f(val))
                return o(val);
            subscribers = subscribers.filter(function (x) { return x !== cb; });
        };
        subscribers.push(cb);
        return o;
    };
    fn.reduce = function (f, acc) {
        var o = createDetachable();
        acc =
            acc === undefined
                ? fn()
                : acc;
        subscribers.push(function (val) {
            acc = f(acc, val);
            o(acc);
        });
        return o;
    };
    fn.maybe = function (f) {
        var success = createDetachable(), error = createDetachable(), cb = function (val) {
            return f(val)
                .then(function (d) { return success(d); })["catch"](function (e) { return error(e); });
        };
        subscribers.push(cb);
        return [success, error];
    };
    fn.stop = function () { return subscribers = []; };
    fn.debounce = function (ms) {
        if (ms === void 0) { ms = 0; }
        var o = createDetachable();
        var timeout, v;
        subscribers.push(function (val) {
            v = val;
            if (!timeout)
                timeout = setTimeout(function ($) {
                    o(v);
                    v = null;
                    timeout = null;
                }, ms);
        });
        return o;
    };
    fn.from = function (f) {
        var o = createDetachable();
        f(function (x) { return o(x); });
        return o;
    };
    fn.union = function () {
        var fs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fs[_i] = arguments[_i];
        }
        var o = createDetachable();
        fs.map(function (f) { return f.then(o); });
        fn.then(o);
        return o;
    };
    fn.attach = function (component, stateIdentifier, extraState, setState, unmount, setUnmount, mount, setMount) {
        if (extraState === void 0) { extraState = {}; }
        if (setState === void 0) { setState = function (d) {
            return component.setState(Object.assign(extraState, stateIdentifier ? (_a = {}, _a[stateIdentifier] = d, _a) : d));
            var _a;
        }; }
        if (unmount === void 0) { unmount = component.componentWillUnmount; }
        if (setUnmount === void 0) { setUnmount = function (x) {
            component.componentWillUnmount = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                unmount && unmount.apply(component, args);
                x.detach();
            };
        }; }
        if (mount === void 0) { mount = component.componentDidMount; }
        if (setMount === void 0) { setMount = function (x) {
            component.componentDidMount = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                mount && mount.apply(component, args);
                x.reattach();
                x.refresh();
            };
        }; }
        var x = createDetachable();
        stateIdentifier && x.then(setState);
        setUnmount(x);
        setMount(x);
        fn.then(x);
        fn.refresh();
        return x;
    };
    fn.scope = function () {
        fn.scoped = true;
        return fn;
    };
    fn.root = function () {
        var r = fn;
        while (!r.scoped && !!r.parent) {
            r = r.parent;
        }
        return r;
    };
    fn.triggerRoot = function (x) {
        fn.root()(x);
    };
    return fn;
});
exports["default"] = obs;
