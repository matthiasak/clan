"use strict";
// batched requests
// The `fetch()` module batches in-flight requests, so if at any point in time, anywhere in my front-end or
// back-end application I have a calls occur to `fetch('http://api.github.com/users/matthiasak')` while another
// to that URL is "in-flight", the Promise returned by both of those calls will be resolved by a single network request.
exports.__esModule = true;
// f :: (url -> options) -> Promise
exports["default"] = (function (f) {
    var inflight = {};
    return function (url, options) {
        if (options === void 0) { options = {}; }
        var method = options.method, key = url + ":" + JSON.stringify(options);
        if ((method || '').toLowerCase() === 'post')
            return f(url, Object.assign({}, options, { compress: false }));
        return inflight[key] ||
            (inflight[key] =
                new Promise(function (res, rej) {
                    f(url, Object.assign({}, options, { compress: false }))
                        .then(function (d) { return res(d); })["catch"](function (e) { return rej(e); });
                })
                    .then(function (data) {
                    var _a;
                    inflight = Object.assign({}, inflight, (_a = {}, _a[key] = undefined, _a));
                    return data;
                })["catch"](function (e) {
                    return console.error(e, url);
                }));
    };
});
