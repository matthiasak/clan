declare var window: object;
declare var Worker: any;

const supports = (...q: string[]) => () =>
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

import obs, {Observable} from './observable'

/*
worker:: [X] -> Worker where X : Function | String

the last X provided in the arguments will be setup as the handler for self.onmessage()
*/

interface Thread {
    postMessage(any): void
    onmessage(Function): void
    onerror(Function): void
}

const worker = (...code): Thread => {
    if(!supportsWorkers()) throw 'WebWorkers not supported'

    code[code.length-1] = `self.onmessage=${code[code.length-1]}`

    const B = supportsBlobs()
        , U = supportsBuilders()
        , W = supportsURLs()

    let blob

    if(B instanceof Function) {
        blob = new B(code.map(c => c+'\n'), {type: 'application/javascript'})
    } else if(U){
        blob = new U
        code.map(c => blob.append(c+'\n'))
        blob = blob.getBlob()
    } else {
        blob = `data:application/javascript,\n${encodeURIComponent(code.reduce((acc,c) => acc+c, ''))}`
    }

    let url = W.createObjectURL(blob)
    return new Worker(url) as Thread
}

export default (code) => {
    let source = obs()
        , w = worker(code)

    return [
        source.then(x => w.postMessage(x))
        , obs().from(f => w.onmessage = (event) => f(event))
        , obs().from(f => w.onerror = (event) => f(event))
    ]
}