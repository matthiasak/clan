"use strict";
// types
exports.__esModule = true;
// code
exports.rAF = !!global.document &&
    (global.requestAnimationFrame ||
        global.webkitRequestAnimationFrame ||
        global.mozRequestAnimationFrame) ||
    (function (cb) { return setTimeout(cb, 16.6); });
exports.hash = function (v, _v) {
    if (_v === void 0) { _v = v === undefined ? 'undefined' : JSON.stringify(v); }
    var hash = 0;
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
