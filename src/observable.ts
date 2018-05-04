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
    map(Function): Observable;
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
// const hash = (v, _v = v === undefined ? 'undefined' : JSON.stringify(v)) => _v

let batchingTime = 0

const obs = ((state?,handler?):Observable => {
    let subscribers:Function[] = []
    let streamHandler = null

    const fn = <Observable>(function(val?){
        if(arguments.length === 0) return state
        handler ? handler(val, cascade) : cascade(val)
    })

    const cascade = (val) => {
        state = val
        for(let i = 0, len = subscribers.length; i<len; i++)
            subscribers[i](val)
    }

    const createDetachable = (handler:Function?) => {
        let x:Observable = obs(null, handler)
        x.detach = $ => {
            const before = subscribers.length
            subscribers = subscribers.filter(s => s !== x)
        }
        x.reattach = $ => {
            x.detach()
            subscribers.push(x)
        }
        x.reattach()
        x.parent = fn
        return x
    }

    fn.computed = () => {
        let prev = null
        return createDetachable((x, cascade) => {
            if(hash(prev) === hash(x)) {
                return
            }
            prev = x
            cascade(x)
        })
    }

    fn.refresh = () => {
        setTimeout($ => cascade(state), 0)
        return fn
    }

    fn.map = f => createDetachable((x, cascade) => cascade(f(x)))

    fn.filter = f => createDetachable((x, cascade) => {
        f(x) && cascade(x)
    })

    fn.then = f => {
        createDetachable((x, cascade) => f(x))
        return fn
    }

    fn.take = n => {
        let count = 0
        let o = createDetachable((x, cascade) => {
            if(count >= n) return o.detach()
            count++
            cascade(x)
        })
    }

    fn.takeWhile = f => {
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

    fn.from = f => {
        const o = createDetachable()
        f(o)
        return o
    }

    fn.union = (...fs) => {
        const o = createDetachable()
        fs.map((f:Observable, i) => f.then(o))
        return o
    }

    fn.tryMap = f =>
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
        , setState = d => component.setState({...extraState, ...(stateIdentifier ? {[stateIdentifier]: d} : d)})
        , unmount = component.componentWillUnmount
        , setUnmount = x => {
            component.componentWillUnmount = (...args) => {
                x.detach()
                unmount && unmount.apply(component, args)
            }
        }
        , mount = component.componentDidMount
        , setMount = (x) => {
            component.componentDidMount = (...args) => {
                mount && mount.apply(component, args)
                x.reattach()
                x.parent() && x.parent.refresh()
            }
        }
    ) => {
        let x =
            fn
            .map(d => {
                setState(d)
                return d
            })

        x.detach() // start detached
        setUnmount(x)
        setMount(x)
        return x
    }

    fn.scope = () => {
        fn.scoped = true
        return fn
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