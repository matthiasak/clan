import { should } from "fuse-test-runner"
import prop from './prop'

export class WorkerTest {
    "Should parse key-maps and arrays"() {
        const x = {a:{b:{c:[0,0,0,0,0,1]}}}
        should(prop(x, 'a.b.c[5]')).equal(1)
    }

    "Should return null if not found"() {
        const x = {a:{b:{c:[0,0,0,0,0,1]}}}
        should(prop(x, 'a.b.c[50]')).equal(null)
    }
}