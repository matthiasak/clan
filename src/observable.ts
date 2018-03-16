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
    (x?:any, cascade?: bool): any;
    detach(x?:any): void;
    reattach(x?:any): void;
    map(Function): Observable;
    filter(Pred): Observable;
    then(Void): Observable;
    take(number): Observable;
    takeWhile(Pred): Observable;
    reduce(Reducer, any?): Observable;
    maybe(M): Observable[];
    stop(): void;
    refresh(): void;
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

// import {hash} from './fp'
const hash = (v, _v = v === undefined ? 'undefined' : JSON.stringify(v)) => _v

const obs = ((state?):Observable => {
    let subscribers:Function[] = []

    const fn = <Observable>(function(val?, noCascade=false){
        if(arguments.length !== 0){
            state = val
            !noCascade && subscribers.map(s => (s instanceof Function) && s(val))
        }
        return state
    })

    const createDetachable = (x:Observable = obs(state)) => {
        x.detach = $ => {
            const i:number = subscribers.indexOf(x)
            if(i !== -1) {
                subscribers = subscribers.filter(s => s !== x)
            }
        }
        x.reattach = $ => {
            const i:number = subscribers.indexOf(x)
            if(i === -1) {
                subscribers.push(x)
            }
            x.parent.refresh()
        }
        x.parent = fn
        return x
    }

    fn.computed = () => {
        const sink = createDetachable()
        let prev = state
        fn.then(x => {
            if(hash(prev) === hash(x)) {
                return
            }
            prev = x
            sink(x)
        })
        return sink
    }

    fn.refresh = () => fn(state)

    fn.map = f => {
      const o = createDetachable()
      subscribers.push(val => o(f(val)))
      return o
    }

    fn.filter = f => {
      const o = createDetachable()
      subscribers.push(val => f(val) && o(val))
      return o
    }

    fn.then = f => {
      subscribers.push(val => f(val))
      return fn
    }

    fn.take = n => {
        let count = 0,
            o = createDetachable()

        const cb = val => {
            if (count <= n) {
                count++
                o(val)
            }

            if (count === n)
                subscribers = subscribers.filter(x => x !== cb)
        }

        subscribers.push(cb)
        return o
    }

    fn.takeWhile = f => {
        let o = createDetachable()

        const cb = val => {
            if(f(val)) return o(val)
            subscribers = subscribers.filter(x => x !== cb)
        }

        subscribers.push(cb)
        return o
    }

    fn.reduce = (f,acc) => {
        const o = createDetachable()

        acc =
            acc === undefined
            ? state
            : acc

        subscribers.push(val => {
            acc = f(acc,val)
            o(acc)
        })

        return o
    }

    fn.maybe = f => {
        const success = createDetachable(),
              error = createDetachable(),
              cb = val =>
                f(val)
                    .then(d => success(d))
                    .catch(e => error(e))

        subscribers.push(cb)

        return [ success, error ]
    }

    fn.stop = () => subscribers = []

    fn.debounce = (ms=0) => {
        const o = createDetachable()

        let timeout, v

        subscribers.push(val => {
            v = val
            if(!timeout)
                timeout = setTimeout(
                    $ => {
                        o(v)
                        v = null
                        timeout = null
                    }
                    , ms)
        })
        return o
    }

    fn.from = f => {
        const o = createDetachable()
        f(x => o(x))
        return o
    }

    fn.union = (...fs) => {
        const o = createDetachable()
        fs.map((f:Observable) => f.then(o))
        fn.then(o)
        return o
    }

    fn.attach = (
        component: VDOM
        , stateIdentifier: string
        , extraState={}
        , setState = d => component.setState({...extraState, ...(stateIdentifier ? {[stateIdentifier]: d} : d)})
        , unmount = component.componentWillUnmount
        , setUnmount = x => {
            component.componentWillUnmount = (...args) => {
                unmount && unmount.apply(component, args)
                x.detach()
            }
        }
        , mount = component.componentDidMount
        , setMount = (x,y) => {
            component.componentDidMount = (...args) => {
                mount && mount.apply(component, args)
                x.reattach()
                y.refresh()
            }
        }
    ) => {
        let x = createDetachable(),
            y = x.computed().then(setState)
        setUnmount(x)
        setMount(x, y)
        fn.then(x)
        return y
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

    fn.triggerRoot = (x) => {
        fn.root()(x)
    }

    return fn
})

export default obs