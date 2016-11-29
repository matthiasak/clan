const supports = (...q) => () =>
    q.reduce((acc,s) =>
        acc
        || (window[s] !== undefined)
        && /[native code]/.test(window[s]+'')
        && window[s]
    , false)

const supportsWorkers = supports('Worker')

const supportsBlobs = supports('Blob')

const supportsURLs = supports('URL', 'webkitURL')

const supportsBuilders = supports('BlobBuilder', 'WebKitBlobBuilder', 'MozBlobBuilder')

/*
worker:: [X] -> Worker where X : Function | String

the last X provided in the arguments will be setup as the handler for self.onmessage()
*/
export const worker = (...code) => {
    if(!supportsWorkers()) throw 'WebWorkers not supported'

    code[code.length-1] = `self.onmessage=${code[code.length-1]}`

    const B = supportsBlobs()
        , U = supportsBuilders()
        , W = supportsURLs()

    let blob

    if(supportsBlobs()) {
        blob =
            new B(code.map(c => c+''),
            {type: 'application/javascript'})

    } else if(U){
        blob = new U
        code.map(c => blob.append(c+''))
        blob = blob.getBlob()
    } else {
        blob = `data:application/javascript,`
            +`${encodeURIComponent(
                code.reduce((acc,c) => acc+c, '')
              )}`
    }

    let url = W.createObjectURL(blob)
    return new Worker(url)
}

export const farm = (n, ...code) => {
    let workers = Array(n).fill(1).map(x => worker(...code))
        , current = 0
        , iter = () => {
            let _n = current
            ++current >= n && (current = 0)
            return current
        }
        , pipe
        , onerror

    workers.map(w => {
        w.onmessage = e => pipe instanceof Function && pipe(e.data)
        w.onerror = e => onerror instanceof Function && onerror(e)
    })

    const exec = (...args) => {
        let w = workers[iter()]
        w && w.postMessage(args)
    }

    exec.pipe = fn => {
        pipe = fn
        return exec
    }
    exec.error = fn => {
        onerror = fn
        return exec
    }
    return exec
}
