
// batched requests
// The `fetch()` module batches in-flight requests, so if at any point in time, anywhere in my front-end or
// back-end application I have a calls occur to `fetch('http://api.github.com/users/matthiasak')` while another
// to that URL is "in-flight", the Promise returned by both of those calls will be resolved by a single network request.

interface Options extends Object {
    method?: string;
}

// f :: (url -> options) -> Promise
export default (f): (string, Options) => Promise<any> => {
    let inflight = {}

    return (url:string, options:Options={}) => {
        let {method} = options,
            key = `${url}:${JSON.stringify(options)}`

        if((method || '').toLowerCase() === 'post')
            return f(url, Object.assign({}, options, {compress: false}))

        return inflight[key] ||
            (inflight[key] =
                new Promise((res,rej) => {
                    f(url, Object.assign({}, options, {compress: false}))
                    .then(d => res(d))
                    .catch(e => rej(e))
                })
                .then(data => {
                    inflight = Object.assign({}, inflight, {[key]: undefined})
                    return data
                })
                .catch(e =>
                    console.error(e, url)))
    }
}
