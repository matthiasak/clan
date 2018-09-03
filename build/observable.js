"use strict";
exports.__esModule = true;
var fp_1 = require("./fp");
var obs = (function (state, handler) {
    var subscribers = [];
    var streamHandler = null;
    var fn = (function (val) {
        if (arguments.length === 0)
            return state;
        handler ? handler(val, cascade) : cascade(val);
    });
    var cascade = function (val) {
        state = val;
        for (var i = 0, len = subscribers.length; i < len; i++)
            subscribers[i](val);
    };
    var createDetachable = function (handler) {
        var x = obs(null, handler);
        x.detach = function () { subscribers = subscribers.filter(function (s) { return s !== x; }); };
        x.reattach = function () { return subscribers.indexOf(x) === -1 ? subscribers.push(x) : null; };
        x.reattach(); // automatically attach
        x.parent = fn;
        return x;
    };
    fn.computed = function () {
        var prev = null;
        return createDetachable(function (x, cascade) {
            if (fp_1.hash(prev) === fp_1.hash(x)) {
                return;
            }
            prev = x;
            cascade(x);
        });
    };
    fn.refresh = function () {
        var val = fn();
        setTimeout(function () { return val && cascade(val); });
    };
    fn.map = function () {
        var fs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fs[_i] = arguments[_i];
        }
        var result = createDetachable(function (x, cascade) { return cascade(fs[0](x)); });
        for (var i = 1, len = fs.length; i < len; i++)
            result = result.map(fs[i]);
        return result;
    };
    var truthy = function (x) { return !!x; };
    fn.filter = function (f) { return createDetachable(function (x, cascade) {
        if ((f || truthy)(x))
            cascade(x);
    }); };
    fn.then = function (f) {
        createDetachable(function (x, cascade) { return f(x); });
        return fn;
    };
    fn.take = function (n) {
        var count = 0;
        var o = createDetachable(function (x, cascade) {
            if (count >= n)
                return o.detach();
            count++;
            cascade(x);
        });
    };
    fn.takeWhile = function (f) {
        var o = createDetachable(function (x, cascade) {
            if (!f(x))
                o.detach();
            cascade(x);
        });
        return o;
    };
    fn.reduce = function (f, acc) {
        return createDetachable(function (x, cascade) {
            acc = f(acc, x);
            cascade(acc);
        });
    };
    fn.maybe = function (f) {
        var error = obs(), success = createDetachable(function (x, cascade) {
            return f(x)
                .then(cascade)["catch"](function (e) { return error(e); });
        });
        // establish chain
        error.parent = success;
        // default to chaining on success
        success[0] = success;
        success[1] = error;
        return success;
    };
    fn.stop = function () { return subscribers = []; };
    fn.debounce = function (ms) {
        if (ms === void 0) { ms = 0; }
        var timeout, v;
        var o = createDetachable(function (x, cascade) {
            v = x;
            if (!timeout) {
                timeout = setTimeout(function () {
                    cascade(v);
                    timeout = null;
                }, ms);
            }
        });
        return o;
    };
    fn.from = function (f) {
        var o = createDetachable();
        f(o);
        return o;
    };
    fn.union = function () {
        var fs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fs[_i] = arguments[_i];
        }
        var o = createDetachable();
        fs.map(function (f, i) { return f.then(o); });
        return o;
    };
    fn.tryMap = function (f) {
        return createDetachable(function (x, cascade) {
            try {
                cascade(f(val));
            }
            catch (e) {
                console.error(e);
                return x;
            }
        });
    };
    fn.attach = function (component, stateIdentifier, extraState) {
        if (extraState === void 0) { extraState = {}; }
        var x = fn.map(function (d) {
            component.setState(extraState);
            component.setState(stateIdentifier ? (_a = {}, _a[stateIdentifier] = d, _a) : d);
            return d;
            var _a;
        });
        var unmount = component.componentWillUnmount || (function () { return true; });
        var mount = component.componentDidMount || (function () { return true; });
        x.detach(); // start detached
        component.componentDidMount = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            x.reattach();
            mount.apply(component, args);
            fn.refresh();
        };
        component.componentWillUnmount = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            x.detach();
            unmount.apply(component, args);
        };
        return x;
    };
    fn.scope = function () {
        var $fn = fn.map(function (x) { return x; });
        $fn.scoped = true;
        return $fn;
    };
    fn.root = function () {
        var r = fn;
        while (!r.scoped && !!r.parent) {
            r = r.parent;
        }
        return r;
    };
    fn.triggerRoot = function (x) { return fn.root()(x); };
    return fn;
});
exports["default"] = obs;
