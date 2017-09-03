import { should } from "fuse-test-runner"
import worker from './worker'

export class WorkerTest {
    "Node test env should throw error"() {
        should().throwException(() => {
            let [source, data, err] = worker(function(x){
                return "echo!"
            })
        })
    }
}