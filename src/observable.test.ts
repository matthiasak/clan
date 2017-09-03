import * as test from "fuse-test-runner"
import obs from './observable'

const {should} = test

export class WorkerTest {
    "Should cascade immediately when triggered"() {
        let x = obs(0)
            , y = x.map(x => x+1)
        
        should(y()).equal(undefined)

        x(0)
        should(y()).equal(1)

        x(1)
        should(y()).equal(2)
    }

    "Computeds should only update on new values"(){
        let x = obs(1)
            , y = x
                .computed()
                .reduce((acc, x) => acc+1, 0)

        should(y()).beUndefined() // should be an empty container first

        x(1)
        should(y()).equal(1)

        x(1)
        should(y()).equal(1)

        x(11)
        should(y()).equal(2)
    }

    "Root should return the nearest scoped observable"(){
        let x = obs()
            , y = 
                x
                .map(x => x+1)
                .scope()
                .map(x => x+1)
                .scope()
            , z =
                y
                .map(x => x+1)
                .map(x => x+1)
                .map(x => x+1)
        
        should(z.root()).equal(y)
    }

    // "Should parse key-maps and arrays"() {
    //     const x = {a:{b:{c:[0,0,0,0,0,1]}}}
    //     should(prop(x, 'a.b.c[5]')).equal(1)
    // }

}