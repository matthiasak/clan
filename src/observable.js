const rAF =
      typeof document !== 'undefined' &&
      (requestAnimationFrame ||
      webkitRequestAnimationFrame ||
      mozRequestAnimationFrame) ||
      process && process.nextTick ||
      (cb => setTimeout(cb, 16.6))

// observables
const obs = (state) => {
    const subscribers = new Set()

    const fn = (val) => {
        if(val !== undefined){
            state = val
            for(let i of subscribers) i(val)
        }
        return state
    }

    fn.map = f => {
      const o = obs()
      subscribers.add(val => o(f(val)))
      return o
    }

    fn.filter = f => {
      const o = obs()
      subscribers.add(val => f(val) && o(val))
      return o
    }

    fn.then = f => {
      subscribers.add(val => f(val))
      return fn
    }

    fn.take = (n) => {
        const values = [],
        	o = obs()

        const cb = val => {
            if(values.length < n)
                values.push(val)

            if(values.length === n) {
                subscribers.delete(cb)
                return o(values)
            }
        }

        subscribers.add(cb)

        return o
    }

    fn.takeWhile = f => {
        const values = [],
        	o = obs()

        const cb = val => {
            if(!f(val)) {
                subscribers.delete(cb)
                return o(values)
            }

			values.push(val)
        }

        subscribers.add(cb)

        return o
    }

    fn.reduce = (f,acc) => {
        const o = obs()

        subscribers.add(val => {
            acc = f(acc,val)
            o(acc)
        })

        return o
    }

    fn.maybe = f => {
        const success = obs(),
              error = obs(),
              cb = val =>
        		f(val)
				    .then(d => success(d))
                    .catch(e => error(e))

        subscribers.add(cb)

        return [ success, error ]
    }

    fn.stop = () => subscribers.clear()

    fn.debounce = ms => {
        const o = obs()
        let ts = +new Date
        subscribers.add(val => {
            const now = +new Date
            if(now - ts >= ms){
                ts = +new Date
                o(val)
            }
        })
        return o
    }

    return fn
}

obs.from = f => {
    const o = obs()
    f(x => o(x))
    return o
}

obs.union = (...fs) => {
    const o = obs()
    fs.map(f => f.then(o))
    return o
}

export default obs