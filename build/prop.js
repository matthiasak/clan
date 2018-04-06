"use strict";
exports.__esModule = true;
exports["default"] = (function (data, propChain, ifNull, map) {
    if (ifNull === void 0) { ifNull = null; }
    if (map === void 0) { map = function (x) { return x; }; }
    var queue = [], r = /\w+|\[|\]|\./ig, i;
    while ((i = r.exec(propChain)))
        queue.push(i[0]);
    var ctx = data || {}, stack = [], t = function () { throw 'Mismatched or missing brackets []'; };
    for (var i_1 = 0, len = queue.length; i_1 < len; i_1++) {
        switch (queue[i_1]) {
            case '.':
                break;
            case '[':
                if (queue[i_1 + 2] !== ']')
                    t();
                ctx = ctx[queue[i_1 + 1]];
                i_1 += 2;
                break;
            default:
                ctx = ctx[queue[i_1]];
                break;
        }
        if (!ctx)
            return ifNull;
    }
    return map(ctx);
});
