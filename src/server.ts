const zlib = require('zlib')
    , fs = require('fs')
    , qs = require('querystring')
    , stream = require('stream')
    , Buffer = require('buffer').Buffer
    , etag = require('etag')
    , path = require('path')

import obs from './observable'
import {Observable} from './observable'

const log = (...a) => console.log(...a)

// cookie middleware
export const cookie = context => {
    const c = (key=undefined, val=undefined) => {
            let {headers={}} = context.req
                , {cookie=''} = headers
                , ck = cookie
                    .split(';')
                    .map(c => c.trim())
                    .filter(c => c.length !== 0)
                    .reduce((acc, c) => {
                        let [key,val] = c.split('=').map(c => c.trim())
                        acc[key] = val
                        return acc
                    }, {})

            if(key !== undefined) {
                if(val === undefined) delete ck[key]
                else ck[key] = val

                context.res.setHeader('Set-Cookie', Object.keys(ck).map(k => `${k}=${ck[k]}`))
            }
            return ck
        }
        , clearCookie = () => context.res.setHeader('Set-Cookie', '')

    context.cookie = c
    context.clearCookie = clearCookie
    return context
}

// send gzipped file
export const sendFile = context => {
    const s = file => {
        const {req, res} = context
        res.statusCode = 200
        addMIME(file, res) // try to auto-set a content-type if sending by URL
        context.__handled = true
        const e = (req.headers['accept-encoding'] || '')
        const buf = file instanceof Buffer ? streamable(file) : fs.createReadStream(file)
        if(e.match(/gzip/)) {
            res.setHeader('content-encoding', 'gzip')
            buf.pipe(zlib.createGzip()).pipe(res)
        } else if(e.match(/deflate/)) {
            res.setHeader('content-encoding', 'deflate')
            buf.pipe(zlib.createDeflate()).pipe(res)
        } else {
            buf.pipe(res)
        }
        return context
    }

    context.sendFile = s
    return context
}

// benchmark handler
export const benchmark = ctx => {
    let before = +new Date
    ctx.res.on('finish', () => {
        let after = +new Date
        console.log(ctx.req.url + ' --- ' + (after-before)+'ms')
    })
    return ctx
}

// parse data streams from req body
export const body = ctx => {
    ctx.body = () =>
        new Promise((res,rej) => {
            let {req} = ctx
            let buf = ''
            req.setEncoding('utf8')
            req.on('data', c => buf += c)
            req.on('end', _ => {
                ctx.body = () => Promise.resolve(buf)
                res(buf)
            })
        })

    return ctx
}

const streamable = buf => {
    let i = 0
        , x = new stream.Readable({
            read(size) {
                if(i < Buffer.byteLength(buf)) {
                    this.push(buf.slice(i,i+size))
                    i = i+size
                } else {
                    this.push(null)
                }
            }
        })
    return x
}

// send gzipped response middleware
export const send = context => {
    const { req, res } = context
        , ifNoneMatch = req.headers['if-none-match']
        , e = req.headers['accept-encoding'] || ''
        , s = (buffer, code=200) => {
            context.__handled = true

            if(typeof buffer === 'number') {
                res.statusCode = buffer
                return res.end()
            } else {
                res.statusCode = code
            }

            if([null, undefined].indexOf(buffer) != -1) return res.end()

            if(!(buffer instanceof Buffer))
                buffer = Buffer.from(typeof buffer === 'object' ? JSON.stringify(buffer) : buffer)

            let etag_buf = etag(buffer)
            if(etag_buf && ifNoneMatch && etag_buf === ifNoneMatch){
                res.statusCode = 304 // not modified
                return res.end('')
            }

            res.setHeader('ETag', etag_buf)
            buffer = streamable(buffer)

            if(e.match(/gzip/)) {
                res.setHeader('content-encoding', 'gzip')
                buffer.pipe(zlib.createGzip()).pipe(res)
            } else if(e.match(/deflate/)) {
                res.setHeader('content-encoding', 'deflate')
                buffer.pipe(zlib.createDeflate()).pipe(res)
            } else {
                buffer.pipe(res)
            }

            return context
        }

    context.send = s
    return context
}

// routing middleware
export const route = type => (url, action) => context => {
    if(context.__handled || context.req.method.toLowerCase() !== type.toLowerCase()) return context

    const {req, res} = context
        , reggie = url.replace(/\/\{((\w*)(\??))\}/ig, '\/?([^\\/]+$3)')
        , r = RegExp(`^${reggie}$`)
        , i = req.url.indexOf('?')
        , v = r.exec(i === -1 ? req.url : req.url.slice(0,i))

    if(!!v) {
        context.__handled = true

        const params = v.slice(1)
            , query = qs.parse(req.url.slice(i+1))

        context.params = params
        context.query = query
        action(context)
    }

    return context
}
export const get = route('get')
export const put = route('put')
export const post = route('post')
export const del = route('delete')
export const patch = route('patch')
export const option = route('option')

export const contextRouting = ctx => {
    ctx.route = t => (...args) => route(t)(...args)(ctx)
    'get,put,post,delete,patch,option'.split(',').map(k => ctx[k] = ctx.route(k))
    return ctx
}

// static file serving async-middleware
export const serve = (folder='./', route='/', cache=true, age = 2628000) => context => {
    if(context.__handled) return Promise.resolve(context)

    const {req, res} = context
        , ifNoneMatch = req.headers['if-none-match']
        , {url: __url} = req
        , q = __url.indexOf('?')
        , hash = __url.indexOf('#')
        , _url = __url.slice(0, q !== -1 ? q : (hash !== -1 ? hash : undefined))
        , url =
            _url
            .slice(1) // remove prefixed /
            .replace(new RegExp(`/^${route}/`,`ig`), '') // remove base-route
        , filepath = `${process.cwd()}/${folder}/${url}`.replace(/\/\//ig, '/') // unescape slashes
        , e = req.headers['accept-encoding'] || ''

    const getFile = (filepath) =>
        new Promise((res, rej) =>
            fs.stat(filepath, (err, stats) =>
                err ? res(context) : rej(stats) ))
        .catch(stats => {
            if(stats.isDirectory()){
                // try /index.html
                return getFile(path.join(filepath, 'index.html'))
            } else if(stats.isFile()){
                context.__handled = true

                let etag_buf = etag(stats)
                if(etag_buf && ifNoneMatch && etag_buf === ifNoneMatch){
                    res.statusCode = 304 // not modified
                    res.end('')
                    return Promise.reject(context)
                }

                res.setHeader('ETag', etag_buf)
                addMIME(filepath, res)

                if(!cache){
                    res.setHeader('cache-control', 'no-cache, no-store, must-revalidate')
                    res.setHeader('Pragma', 'no-cache')
                    res.setHeader('Expires', '-1')
                } else {
                    res.setHeader('cache-control', `public, max-age=${age}`)
                    res.setHeader('Pragma', 'cache')
                    res.setHeader('Expires', new Date(+new Date + age*1000).toUTCString())
                }

                if(e.match(/gzip/)) {
                    res.setHeader('content-encoding', 'gzip')
                    fs.createReadStream(filepath).pipe(zlib.createGzip()).pipe(res)
                } else if(e.match(/deflate/)) {
                    res.setHeader('content-encoding', 'deflate')
                    fs.createReadStream(filepath).pipe(zlib.createDeflate()).pipe(res)
                } else {
                    fs.createReadStream(filepath).pipe(res)
                }

                return Promise.reject(context)
                // return context // dont continue down the server pipeline
            }

            return context // continue down the server pipeline
        })

    return getFile(filepath)
}

export const contextServing = ctx => {
    ctx.serve = serve
    return ctx
}

const addMIME = (url, res) => {
    if(typeof url !== 'string') return
    const c = 'Content-Type'
    url.match(/\.js$/) && res.setHeader(c, 'text/javascript')
    url.match(/\.json$/) && res.setHeader(c, 'application/json')
    url.match(/\.pdf$/) && res.setHeader(c, 'application/pdf')
    url.match(/\.html$/) && res.setHeader(c, 'text/html')
    url.match(/\.css$/) && res.setHeader(c, 'text/css')

    url.match(/\.jpe?g$/) && res.setHeader(c, 'image/jpeg')
    url.match(/\.png$/) && res.setHeader(c, 'image/png')
    url.match(/\.gif$/) && res.setHeader(c, 'image/gif')
    url.match(/\.svg$/) && res.setHeader(c, 'image/svg+xml')
}

export const server = (port=3000, timeout=5000, keepAlive=timeout, useCluster=true) => {
    const http = require('http')
        , cluster = require('cluster')
        , domain = require('domain')
        , numCPUs = require('os').cpus().length

    const pipe = defaultPipe()
        , root = pipe.root()
        , boot = () => {
            const s = http.createServer((req, res) => root({req, res}))
            s.listen(port, (err) => err && console.error(err) || console.log(`Server running at :${port} on process ${process.pid}`))
            s.timeout = timeout
            s.keepAliveTimeout = keepAlive
        }

    if (cluster.isMaster && useCluster) {
        for (var i = 0; i < numCPUs; i++) cluster.fork()
        const onClose = worker => {
            console.error('Worker closing. Restarting...')
            cluster.fork()
        }
        cluster.on('disconnect', onClose)
        // cluster.on('exit', onClose)
    } else {
        boot()
    }

    return pipe
}
export default server

export const setHeader = ctx => {
    ctx.setHeader = (key, val) => ctx.res.setHeader(key, val)
    return ctx
}

export const defaultPipe = $ =>
    obs()
    .map(
        cookie,
        send,
        setHeader,
        sendFile,
        benchmark,
        body,
        contextRouting,
        contextServing
    )