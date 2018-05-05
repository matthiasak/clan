"use strict";
exports.__esModule = true;
var zlib = require('zlib'), fs = require('fs'), qs = require('querystring'), stream = require('stream'), Buffer = require('buffer').Buffer, etag = require('etag'), path = require('path');
var observable_1 = require("./observable");
var log = function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return console.log.apply(console, a);
};
// cookie middleware
exports.cookie = function (context) {
    var c = function (key, val) {
        if (key === void 0) { key = undefined; }
        if (val === void 0) { val = undefined; }
        var _a = context.req.headers, headers = _a === void 0 ? {} : _a, _b = headers.cookie, cookie = _b === void 0 ? '' : _b, ck = cookie
            .split(';')
            .map(function (c) { return c.trim(); })
            .filter(function (c) { return c.length !== 0; })
            .reduce(function (acc, c) {
            var _a = c.split('=').map(function (c) { return c.trim(); }), key = _a[0], val = _a[1];
            acc[key] = val;
            return acc;
        }, {});
        if (key !== undefined) {
            if (val === undefined)
                delete ck[key];
            else
                ck[key] = val;
            context.res.setHeader('Set-Cookie', Object.keys(ck).map(function (k) { return k + "=" + ck[k]; }));
        }
        return ck;
    }, clearCookie = function () { return context.res.setHeader('Set-Cookie', ''); };
    context.cookie = c;
    context.clearCookie = clearCookie;
    return context;
};
// send gzipped file
exports.sendFile = function (context) {
    var s = function (file) {
        var req = context.req, res = context.res;
        res.statusCode = 200;
        addMIME(file, res); // try to auto-set a content-type if sending by URL
        context.__handled = true;
        var e = (req.headers['accept-encoding'] || '');
        var buf = file instanceof Buffer ? streamable(file) : fs.createReadStream(file);
        if (e.match(/gzip/)) {
            res.setHeader('content-encoding', 'gzip');
            buf.pipe(zlib.createGzip()).pipe(res);
        }
        else if (e.match(/deflate/)) {
            res.setHeader('content-encoding', 'deflate');
            buf.pipe(zlib.createDeflate()).pipe(res);
        }
        else {
            buf.pipe(res);
        }
        return context;
    };
    context.sendFile = s;
    return context;
};
// benchmark handler
exports.benchmark = function (ctx) {
    var before = +new Date;
    ctx.res.on('finish', function () {
        var after = +new Date;
        console.log(ctx.req.url + ' --- ' + (after - before) + 'ms');
    });
    return ctx;
};
// parse data streams from req body
exports.body = function (ctx) {
    ctx.body = function () {
        return new Promise(function (res, rej) {
            var req = ctx.req;
            var buf = '';
            req.setEncoding('utf8');
            req.on('data', function (c) { return buf += c; });
            req.on('end', function (_) {
                ctx.body = function () { return Promise.resolve(buf); };
                res(buf);
            });
        });
    };
    return ctx;
};
var streamable = function (buf) {
    var i = 0, x = new stream.Readable({
        read: function (size) {
            if (i < Buffer.byteLength(buf)) {
                this.push(buf.slice(i, i + size));
                i = i + size;
            }
            else {
                this.push(null);
            }
        }
    });
    return x;
};
// send gzipped response middleware
exports.send = function (context) {
    var req = context.req, res = context.res, ifNoneMatch = req.headers['if-none-match'], e = req.headers['accept-encoding'] || '', s = function (buffer, code) {
        if (code === void 0) { code = 200; }
        context.__handled = true;
        if (typeof buffer === 'number') {
            res.statusCode = buffer;
            return res.end();
        }
        else {
            res.statusCode = code;
        }
        if ([null, undefined].indexOf(buffer) != -1)
            return res.end();
        if (!(buffer instanceof Buffer))
            buffer = Buffer.from(typeof buffer === 'object' ? JSON.stringify(buffer) : buffer);
        var etag_buf = etag(buffer);
        if (etag_buf && ifNoneMatch && etag_buf === ifNoneMatch) {
            res.statusCode = 304; // not modified
            return res.end('');
        }
        res.setHeader('ETag', etag_buf);
        buffer = streamable(buffer);
        if (e.match(/gzip/)) {
            res.setHeader('content-encoding', 'gzip');
            buffer.pipe(zlib.createGzip()).pipe(res);
        }
        else if (e.match(/deflate/)) {
            res.setHeader('content-encoding', 'deflate');
            buffer.pipe(zlib.createDeflate()).pipe(res);
        }
        else {
            buffer.pipe(res);
        }
        return context;
    };
    context.send = s;
    return context;
};
// routing middleware
exports.route = function (type) { return function (url, action) { return function (context) {
    if (context.__handled || context.req.method.toLowerCase() !== type.toLowerCase())
        return context;
    var req = context.req, res = context.res, reggie = url.replace(/\/\{((\w*)(\??))\}/ig, '\/?(\\w+$3)'), r = RegExp("^" + reggie + "$"), i = req.url.indexOf('?'), v = r.exec(i === -1 ? req.url : req.url.slice(0, i));
    if (!!v) {
        context.__handled = true;
        var params = v.slice(1), query = qs.parse(req.url.slice(i + 1));
        context.params = params;
        context.query = query;
        action(context);
    }
    return context;
}; }; };
exports.get = exports.route('get');
exports.put = exports.route('put');
exports.post = exports.route('post');
exports.del = exports.route('delete');
exports.patch = exports.route('patch');
exports.option = exports.route('option');
exports.contextRouting = function (ctx) {
    ctx.route = function (t) { return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return exports.route(t).apply(void 0, args)(ctx);
    }; };
    'get,put,post,delete,patch,option'.split(',').map(function (k) { return ctx[k] = ctx.route(k); });
    return ctx;
};
// static file serving async-middleware
exports.serve = function (folder, route, cache, age) {
    if (folder === void 0) { folder = './'; }
    if (route === void 0) { route = '/'; }
    if (cache === void 0) { cache = true; }
    if (age === void 0) { age = 2628000; }
    return function (context) {
        if (context.__handled)
            return Promise.resolve(context);
        var req = context.req, res = context.res, ifNoneMatch = req.headers['if-none-match'], __url = req.url, q = __url.indexOf('?'), hash = __url.indexOf('#'), _url = __url.slice(0, q !== -1 ? q : (hash !== -1 ? hash : undefined)), url = _url
            .slice(1) // remove prefixed /
            .replace(new RegExp("/^" + route + "/", "ig"), '') // remove base-route
        , filepath = (process.cwd() + "/" + folder + "/" + url).replace(/\/\//ig, '/') // unescape slashes
        , e = req.headers['accept-encoding'] || '';
        var getFile = function (filepath) {
            return new Promise(function (res, rej) {
                return fs.stat(filepath, function (err, stats) {
                    return err ? res(context) : rej(stats);
                });
            })["catch"](function (stats) {
                if (stats.isDirectory()) {
                    // try /index.html
                    return getFile(path.join(filepath, 'index.html'));
                }
                else if (stats.isFile()) {
                    context.__handled = true;
                    var etag_buf = etag(stats);
                    if (etag_buf && ifNoneMatch && etag_buf === ifNoneMatch) {
                        res.statusCode = 304; // not modified
                        res.end('');
                        return Promise.reject(context);
                    }
                    res.setHeader('ETag', etag_buf);
                    addMIME(filepath, res);
                    if (!cache) {
                        res.setHeader('cache-control', 'no-cache, no-store, must-revalidate');
                        res.setHeader('Pragma', 'no-cache');
                        res.setHeader('Expires', '-1');
                    }
                    else {
                        res.setHeader('cache-control', "public, max-age=" + age);
                        res.setHeader('Pragma', 'cache');
                        res.setHeader('Expires', new Date(+new Date + age * 1000).toUTCString());
                    }
                    if (e.match(/gzip/)) {
                        res.setHeader('content-encoding', 'gzip');
                        fs.createReadStream(filepath).pipe(zlib.createGzip()).pipe(res);
                    }
                    else if (e.match(/deflate/)) {
                        res.setHeader('content-encoding', 'deflate');
                        fs.createReadStream(filepath).pipe(zlib.createDeflate()).pipe(res);
                    }
                    else {
                        fs.createReadStream(filepath).pipe(res);
                    }
                    return Promise.reject(context);
                    // return context // dont continue down the server pipeline
                }
                return context; // continue down the server pipeline
            });
        };
        return getFile(filepath);
    };
};
exports.contextServing = function (ctx) {
    ctx.serve = exports.serve;
    return ctx;
};
var addMIME = function (url, res) {
    if (typeof url !== 'string')
        return;
    var c = 'Content-Type';
    url.match(/\.js$/) && res.setHeader(c, 'text/javascript');
    url.match(/\.json$/) && res.setHeader(c, 'application/json');
    url.match(/\.pdf$/) && res.setHeader(c, 'application/pdf');
    url.match(/\.html$/) && res.setHeader(c, 'text/html');
    url.match(/\.css$/) && res.setHeader(c, 'text/css');
    url.match(/\.jpe?g$/) && res.setHeader(c, 'image/jpeg');
    url.match(/\.png$/) && res.setHeader(c, 'image/png');
    url.match(/\.gif$/) && res.setHeader(c, 'image/gif');
    url.match(/\.svg$/) && res.setHeader(c, 'image/svg+xml');
};
exports.server = function (port, timeout, keepAlive, useCluster) {
    if (port === void 0) { port = 3000; }
    if (timeout === void 0) { timeout = 5000; }
    if (keepAlive === void 0) { keepAlive = timeout; }
    if (useCluster === void 0) { useCluster = true; }
    var http = require('http'), cluster = require('cluster'), domain = require('domain'), numCPUs = require('os').cpus().length;
    var pipe = exports.defaultPipe(), root = pipe.root(), boot = function () {
        var s = http.createServer(function (req, res) { return root({ req: req, res: res }); });
        s.listen(port, function (err) { return err && console.error(err) || console.log("Server running at :" + port + " on process " + process.pid); });
        s.timeout = timeout;
        s.keepAliveTimeout = keepAlive;
    };
    if (cluster.isMaster && useCluster) {
        for (var i = 0; i < numCPUs; i++)
            cluster.fork();
        var onClose = function (worker) {
            console.error('Worker closing. Restarting...');
            cluster.fork();
        };
        cluster.on('disconnect', onClose);
        // cluster.on('exit', onClose)
    }
    else {
        boot();
    }
    return pipe;
};
exports["default"] = exports.server;
exports.setHeader = function (ctx) {
    ctx.setHeader = function (key, val) { return ctx.res.setHeader(key, val); };
    return ctx;
};
exports.defaultPipe = function ($) {
    return observable_1["default"]()
        .map(exports.cookie, exports.send, exports.setHeader, exports.sendFile, exports.benchmark, exports.body, exports.contextRouting, exports.contextServing);
};
