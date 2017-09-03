interface Module {
    exports: Object;
}
declare var module: Module;

import batch from './batch'
import model from './model'
import obs from './observable'
import * as worker from './worker'
import prop from './prop'
import {rAF, hash, mapping, filtering} from './fp'
import * as server from './server'

module.exports = {
    batch
    , model
    , obs
    , worker
    , hash
    , prop
    , rAF
    , mapping
    , filtering
    , server
}
