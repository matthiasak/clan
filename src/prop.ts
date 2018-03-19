export default (
    data:object,
    propChain:string, ifNull:any = null,
    map:Function = x=>x
): any => {
    let queue = []
        , r = /\w+|\[|\]|\./ig
        , i

    while((i = r.exec(propChain))) queue.push(i[0])

    let ctx = data || {}
        , stack = []
        , t = () => { throw 'Mismatched or missing brackets []' }

    for(let i = 0, len = queue.length; i < len; i++){
        switch(queue[i]){
            case '.':
                break
            case '[':
                if(queue[i+2] !== ']') t()
                ctx = ctx[queue[i+1]]
                i+=2
                break
            default:
                ctx = ctx[queue[i]]
                break
        }

        if(!ctx) return ifNull
    }

    return map(ctx)
}
