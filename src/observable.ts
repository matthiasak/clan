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
    (any?, bool?): any;
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
    setGlobalBatchingTime(x:number): void;
}

// import {hash} from './fp'
const hash = (v, _v = v === undefined ? 'undefined' : JSON.stringify(v)) => _v

let batchingTime = 0

const obs = ((state?):Observable => {
    let subscribers:Function[] = []

    const fn = <Observable>(function(val?, noCascade=false){
        if(arguments.length !== 0){
            state = val
            !noCascade && subscribers.map(s => (s instanceof Function) && s(val))
        }
        return state
    })

    const createDetachable = (x:Observable = obs()) => {
        x.detach = $ => {
            subscribers = subscribers.filter(s => s !== x)
        }
        x.reattach = $ => subscribers.push(x)
        x.parent = fn
        return x
    }

    fn.setGlobalBatchingTime = (x:number) => {
        batchingTime = Math.max(x, 0)
    }

    fn.computed = () => {
        const sink = createDetachable()
        let prev = null
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
        acc = acc === undefined ? f() : acc
        subscribers.push(val => {
            acc = f(acc,val)
            o(acc)
        })
        return o
    }

    fn.maybe = (f, batching=batchingTime) => {
        const success = createDetachable(),
              error = createDetachable(),
              source = batching !== 0 ? createDetachable().scope().debounce(batching) : createDetachable().scope()

        source.then(val =>
            f(val)
            .then(d => success(d))
            .catch(e => error(e)))

        fn.then(source.root())

        success[0] = success
        success[1] = error

        return success
    }

    fn.stop = () => subscribers = []

    fn.debounce = (ms=0) => {
        const o = createDetachable()
        let timeout, v
        fn.then(val => {
            v = val
            if(!timeout) {
                timeout = setTimeout(() => {
                    o(v)
                    timeout = null
                }, ms)
            }
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
        fs.map((f:Observable, i) => f.then(o))
        fn.then(o)
        return o
    }

    fn.tryMap = f => {
      const o = createDetachable()
      subscribers.push(val => {
          try {
              o(f(val))
          } catch(e) {
              console.error(e)
          }
      })
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
        , setMount = (x) => {
            component.componentDidMount = (...args) => {
                mount && mount.apply(component, args)
                x.reattach()
                x.parent() && x.parent.refresh()
            }
        }
    ) => {
        let x = createDetachable().then(setState)
        setUnmount(x)
        setMount(x)
        fn.then(x)
        x.parent.refresh()
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

    fn.triggerRoot = (x) => {
        fn.root()(x)
    }

    return fn
})

export default obs