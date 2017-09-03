import { should } from "fuse-test-runner"
const {mapping, filtering, rAF} = require('./fp')

const compose = (a: (x:any) => any, b: (x:any) => any) => i => a(b(i))

export class TransducerTest {
    "Should map and filter correctly"() {
        // example transducer usage:
        const concat = (thing, value) => thing.concat([value])
        const inc = x => x+1
        const greaterThanTwo = x => x>2
        const incGreaterThanTwo = compose(
            mapping(inc),
            filtering(greaterThanTwo)
        )
        should(
            [1,2,3,4].reduce(incGreaterThanTwo(concat), [])
        )
        .deepEqual([3,4,5])
    }
}

export class rAFTest {
    "Should not run immediately"() {
        let x = 1
        rAF($ => x++)
        should(x).equal(1)
    }
}