"use strict";
exports.__esModule = true;
var supports = function () {
    var q = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        q[_i] = arguments[_i];
    }
    return function () {
        return q.reduce(function (acc, s) {
            return acc
                || (window[s] !== undefined)
                    && /[native code]/.test(window[s] + '')
                    && window[s];
        }, false);
    };
};
var supportsWorkers = supports('Worker');
var supportsBlobs = supports('Blob');
var supportsURLs = supports('URL', 'webkitURL');
var supportsBuilders = supports('BlobBuilder', 'WebKitBlobBuilder', 'MozBlobBuilder');
var observable_1 = require("./observable");
var worker = function () {
    var code = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        code[_i] = arguments[_i];
    }
    if (!supportsWorkers())
        throw 'WebWorkers not supported';
    code[code.length - 1] = "self.onmessage=" + code[code.length - 1];
    var B = supportsBlobs(), U = supportsBuilders(), W = supportsURLs();
    var blob;
    if (B instanceof Function) {
        blob = new B(code.map(function (c) { return c + '\n'; }), { type: 'application/javascript' });
    }
    else if (U) {
        blob = new U;
        code.map(function (c) { return blob.append(c + '\n'); });
        blob = blob.getBlob();
    }
    else {
        blob = "data:application/javascript,\n" + encodeURIComponent(code.reduce(function (acc, c) { return acc + c; }, ''));
    }
    var url = W.createObjectURL(blob);
    return new Worker(url);
};
exports["default"] = function (code) {
    var source = observable_1["default"](), w = worker(code);
    return [
        source.then(function (x) { return w.postMessage(x); }),
        observable_1["default"]().from(function (f) { return w.onmessage = function (event) { return f(event); }; }),
        observable_1["default"]().from(function (f) { return w.onerror = function (event) { return f(event); }; })
    ];
};
