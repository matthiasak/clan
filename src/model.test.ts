import { should } from "fuse-test-runner"
import model from './model'

export class ModelTest {
    "Should parse and check validity"() {
        // create a Name model with required first/last,
        // but optional middle
        let Name = model.init({
            first: String,
            middle: String,
            last: String
        }, {first:true, last:true})

        // create a Tags model with extra checks
        let Tags = model.init((types,required,data) => {
            if(!(data instanceof Array)) throw `${data} not an Array`
            data.map(x => {
                if(!model.is(String, x))
                    throw `[${data}] contains non-String`
            })
            return true
        })

        // create a Price model that just has a business logic fn
        let Price = model.init((t,r,d) => {
            return (d instanceof Number || typeof d === 'number') && d !== 0
        })

        // create an Activity model with a required type and name,
        // all others optional
        let Activity = model.init({
            type: [String, Function, Number],
            latlng: Array,
            title: String,
            tags: Tags,
            name: Name,
            price: Price
        }, 
        {
            name:true, 
            price: true
        })

        // create a new Activity instance, throwing errors if there are
        // any invalid fields.
        let a = {
            tags: ['1','2'],
            type: 1,
            name: {first:'matt',last:'keas'},
            price: 100.43,
            url: 'http://www.google.com'
        }

        should(Activity.isValid(a)).beTrue()
    }
}