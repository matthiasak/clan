"use strict";
// types
exports.__esModule = true;
// code
exports.rAF = !!global.document &&
    (global.requestAnimationFrame ||
        global.webkitRequestAnimationFrame ||
        global.mozRequestAnimationFrame) ||
    (function (cb) { return setTimeout(cb, 16.6); });
exports.hash = function (v) {
    if (v === null || v === undefined || typeof v !== 'object')
        return v;
    var keys = Object.keys(v);
    keys.sort();
    var keyOrderedHash = keys.reduce(function (acc, key) {
        acc[key] = v[key];
        return acc;
    }, {});
    var hash = 0, _v = JSON.stringify(keyOrderedHash);
    for (var i = 0, len = _v.length; i < len; ++i) {
        var c = _v.charCodeAt(i);
        hash = (((hash << 5) - hash) + c) | 0;
    }
    return hash;
};
// Transducers
exports.mapping = function (mapper) {
    return function (reducer) {
        return function (result, value) {
            return reducer(result, mapper(value));
        };
    };
};
exports.filtering = function (predicate) {
    return function (reducer) {
        return function (result, value) {
            return predicate(value) ? reducer(result, value) : result;
        };
    };
};
