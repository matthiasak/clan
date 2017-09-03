// types 

interface Validator {
    (types: object, required: object, data: object): boolean;
}

export interface Model {
    is(type, value:any): boolean;
    check(types: object, required: object, data: object): boolean;
    init(types: object): ModelInstance;
    init(types: object, validator: Function): ModelInstance;
    init(types: object, required: object, validator: Function): ModelInstance;
    init(types: object, required: object): ModelInstance;
    ArrayOf(M: Function): ModelInstance;
}

export interface ModelInstance {
    isValid(data: object): boolean;
    whenValid(data: object): Promise<object>;
}

// code

// Validate JS objects for their "shape"
const model:Model = {
    is(type, value) {
        if(type && type.isValid instanceof Function){
            return type.isValid(value)
        } else if((type === String && ((value instanceof String) || typeof value === 'string'))
            || (type === Number && ((value instanceof Number) || typeof value === 'number'))
            || (type === Boolean && ((value instanceof Boolean) || typeof value === 'boolean'))
            || (type === Function && ((value instanceof Function) || typeof value === 'function'))
            || (type === Object && ((value instanceof Object) || typeof value === 'object'))
            || (type === undefined)
        ){
            return true
        }

        return false
    },
    check(types, required, data) {
        Object.keys(types).forEach(key => {
            let t = types[key],
                value = data[key]

            if(required[key] || value !== undefined){
                if(!(t instanceof Array)) t = [t]

                let i = t.reduce((a,_type) => a || model.is(_type, value), false)
                if(!i) {
                    throw `{${key}: ${JSON.stringify(value)}} is not one of ${t.map(x => `\n - ${x}`)}`
                }
            }
        })

        return true
    },
    init(...args) {
        let types, required, logic
        args.map(x => {
            if(x instanceof Function && !logic){ logic = x }
            else if(typeof x === 'object') {
                if(!types){ types = x }
                else if(!required){ required = x }
            }
        })

        const isValid = (data) => {
            const pipe = logic ? [model.check, logic] : [model.check]
            return pipe.reduce((a,v) => a && v(types||{},required||{},data), true)
        }

        const whenValid = (data) => new Promise((res,rej) => isValid(data) && res(data))

        return {isValid, whenValid}
    },
    ArrayOf(M) {
        return model.init((t,r,data) => {
            if(!(data instanceof Array)) throw `${data} not an Array`
            data.map(x => {
                if(!model.is(M, x))
                    throw `${x} is not a model instance`
            })
            return true
        })
    }
}

export default model
