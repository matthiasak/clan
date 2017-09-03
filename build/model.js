"use strict";
// types 
exports.__esModule = true;
// code
// Validate JS objects for their "shape"
var model = {
    is: function (type, value) {
        if (type && type.isValid instanceof Function) {
            return type.isValid(value);
        }
        else if ((type === String && ((value instanceof String) || typeof value === 'string'))
            || (type === Number && ((value instanceof Number) || typeof value === 'number'))
            || (type === Boolean && ((value instanceof Boolean) || typeof value === 'boolean'))
            || (type === Function && ((value instanceof Function) || typeof value === 'function'))
            || (type === Object && ((value instanceof Object) || typeof value === 'object'))
            || (type === undefined)) {
            return true;
        }
        return false;
    },
    check: function (types, required, data) {
        Object.keys(types).forEach(function (key) {
            var t = types[key], value = data[key];
            if (required[key] || value !== undefined) {
                if (!(t instanceof Array))
                    t = [t];
                var i = t.reduce(function (a, _type) { return a || model.is(_type, value); }, false);
                if (!i) {
                    throw "{" + key + ": " + JSON.stringify(value) + "} is not one of " + t.map(function (x) { return "\n - " + x; });
                }
            }
        });
        return true;
    },
    init: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var types, required, logic;
        args.map(function (x) {
            if (x instanceof Function && !logic) {
                logic = x;
            }
            else if (typeof x === 'object') {
                if (!types) {
                    types = x;
                }
                else if (!required) {
                    required = x;
                }
            }
        });
        var isValid = function (data) {
            var pipe = logic ? [model.check, logic] : [model.check];
            return pipe.reduce(function (a, v) { return a && v(types || {}, required || {}, data); }, true);
        };
        var whenValid = function (data) { return new Promise(function (res, rej) { return isValid(data) && res(data); }); };
        return { isValid: isValid, whenValid: whenValid };
    },
    ArrayOf: function (M) {
        return model.init(function (t, r, data) {
            if (!(data instanceof Array))
                throw data + " not an Array";
            data.map(function (x) {
                if (!model.is(M, x))
                    throw x + " is not a model instance";
            });
            return true;
        });
    }
};
exports["default"] = model;
