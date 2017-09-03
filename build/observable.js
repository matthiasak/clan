"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var fp_1 = require("./fp");
var obs = (function (state) {
    var subscribers = [];
    var fn = (function (val) {
        if (val !== undefined) {
            state = val;
            for (var i = 0, len = subscribers.length; i < len; i++)
                subscribers[i](val);
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
        var prev = undefined;
        fn.then(function (x) {
            if (fp_1.hash(prev) === fp_1.hash(x))
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
    fn.attach = function (component, stateIdentifier, extraState, setState, unmount, setUnmount) {
        if (extraState === void 0) { extraState = {}; }
        if (setState === void 0) { setState = function (d) {
            return component.setState(__assign({}, extraState, (_a = {}, _a[stateIdentifier] = d, _a)));
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
                x.detach(); // auto-detach!
            };
        }; }
        var x = fn.computed();
        stateIdentifier && x.map(setState);
        setUnmount(x);
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
    return fn;
});
exports["default"] = obs;
