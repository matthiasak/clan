declare var setTimeout: Function;

interface VDOM {
    setState(newState: any): void;
    setState(reducer: Function): void;
    componentWillUnmount: Function;
    componentDidMount: Function;
}

interface Pred {
    (x:any): boolean
}

interface Void {
    (x:any): void
}

interface Reducer {
    (acc: any, v: any): any
}

interface M {
    (x:any): Promise<any>
}

export interface Observable {
    (any?, Function?): any;
    detach(any?): void;
    reattach(any?): void;
    map(...transforms: Function[]): Observable;
    tryMap(Function): Observable;
    filter(Pred): Observable;
    then(Void): Observable;
    take(number): Observable;
    takeWhile(Pred): Observable;
    reduce(Reducer, any?): Observable;
    maybe(M, number?): Observable;
    stop(): void;
    refresh(): Observable;
    computed(): Observable;
    debounce(number);
    from(Function): Observable;
    union(...sources: Function[]): Observable;
    attach(component:Object, stateIdentifier:String, extraState:Object): Observable;
    scope(): Observable;
    root(): Observable;
    scoped: boolean;
    parent: Observable;
    triggerRoot(x?:any): void;
}

import {hash} from './fp'
const obs = ((state?,handler?):Observable => {
    let subscribers:Function[] = []
    let streamHandler = null

    const fn = <Observable>(function(val?){
        if(arguments.length === 0) return state
        handler ? handler(val, cascade) : cascade(val)
    })

    const cascade = (val) => {
        state = val
        for(let i = 0, len = subscribers.length; i<len; i++) subscribers[i](val)
    }

    const createDetachable = (handler:Function?) => {
        let x:Observable = obs(null, handler)
        x.detach = () => { subscribers = subscribers.filter(s => s !== x) }
        x.reattach = () => subscribers.indexOf(x) === -1 ? subscribers.push(x) : null
        x.reattach() // automatically attach
        x.parent = fn
        return x
    }

    fn.computed = () => {
        let prev = null
        return createDetachable((x, cascade) => {
            if(hash(prev) === hash(x)) {
                return;
            }
            prev = x
            cascade(x)
        })
    }

    fn.refresh = () => {
        let val = fn()
        setTimeout(() => val && cascade(val))
    }

    fn.map = (...fs) => {
        let result = createDetachable((x, cascade) => cascade(fs[0](x)))
        for(let i = 1, len = fs.length; i<len; i++)
            result = result.map(fs[i])
        return result
    }

    const truthy = x => !!x
    fn.filter = (f) => createDetachable((x, cascade) => {
        if((f || truthy)(x)) cascade(x)
    })

    fn.then = (f) => {
        createDetachable((x, cascade) => f(x))
        return fn
    }

    fn.take = (n) => {
        let count = 0
        let o = createDetachable((x, cascade) => {
            if(count >= n) return o.detach()
            count++
            cascade(x)
        })
    }

    fn.takeWhile = (f) => {
        let o = createDetachable((x, cascade) => {
            if(!f(x)) o.detach()
            cascade(x)
        })
        return o
    }

    fn.reduce = (f,acc) =>
        createDetachable((x, cascade) => {
            acc = f(acc, x)
            cascade(acc)
        })

    fn.maybe = (f) => {
        let error = obs(),
            success = createDetachable(
                (x, cascade) =>
                    f(x)
                    .then(cascade)
                    .catch(e => error(e))
            )

        // establish chain
        error.parent = success

        // default to chaining on success
        success[0] = success
        success[1] = error
        return success
    }

    fn.stop = () => subscribers = []

    fn.debounce = (ms=0) => {
        let timeout, v
        let o = createDetachable((x, cascade) => {
            v = x
            if(!timeout){
                timeout = setTimeout(() => {
                    cascade(v)
                    timeout = null
                }, ms)
            }
        })
        return o
    }

    fn.from = (f) => {
        const o = createDetachable()
        f(o)
        return o
    }

    fn.union = (...fs) => {
        const o = createDetachable()
        fs.map((f:Observable, i) => f.then(o))
        return o
    }

    fn.tryMap = (f) =>
        createDetachable((x, cascade) => {
            try {
                cascade(f(val))
            } catch(e) {
                console.error(e)
                return x
            }
        })

    fn.attach = (
        component: VDOM
        , stateIdentifier: string
        , extraState={}
    ) => {
        let x = fn.map((d) => {
            component.setState(extraState)
            component.setState(stateIdentifier ? {[stateIdentifier]: d} : d)
            return d
        })
        let unmount = component.componentWillUnmount || (() => true)
        let mount = component.componentDidMount || (() => true)
        x.detach() // start detached
        component.componentDidMount = (...args) => {
            x.reattach()
            mount.apply(component, args)
            fn.refresh()
        }
        component.componentWillUnmount = (...args) => {
            x.detach()
            unmount.apply(component, args)
        }
        return x
    }

    fn.scope = () => {
        let $fn = fn.map(x => x)
        $fn.scoped = true
        return $fn
    }

    fn.root = () => {
        let r = fn
        while(!r.scoped && !!r.parent){
            r = r.parent
        }
        return r
    }

    fn.triggerRoot = (x) => fn.root()(x)

    return fn
})

export default obs