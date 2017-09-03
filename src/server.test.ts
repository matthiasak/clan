import {server, cookie, send, sendFile, serve, route, get, put, post, patch, del} from './server'
import * as test from "fuse-test-runner"
import obs from './observable'
const {should} = test

const log = (...a) => console.log(...a)

const benchmark = (message?:string) => context => {
    let before = +new Date
    context.res.on('finish', () => {
        let after = +new Date
        console.log(message ? message+':' : '', after-before+'ms')
    })
    return context
}

export class ServerTest {
    "Should cascade http server context through the observable pipeline"(){
        const start = obs()

        start
            .map(benchmark())
            .map(send)
            .map(cookie)
            .maybe(serve('src/'))[0]
            .map(get('/', ctx => ctx.send('hello world')))
            .map(get('/api', c => c.send('api page '+Math.random())))
            .map(get('/notes', c => c.send(`main notes page`)))
            .map(get('/notes/{id}', c => c.send(`notes page - ${c.params[0]}`)))
            .map(get('.*', c => c.send(404)))

        server(start, 3000)
    }
    "Should support sync and async middleware"(){
        const start = obs()

        start
            .map(benchmark())
            .map(send)
            .map(get('/', ctx => ctx.send('hello world')))
            .map(context => {
                return {...context, name: Math.random() < .5 ? 'Matt' : 'Mark'}
            })
            .map(get('/github/{username}', async c => {
                await new Promise(res => setTimeout(() => res(), 1500)) // wait 1.5s
                c.send('some test JSON'.split(' '))
            }))
            .map(get('.*', c => c.send(404)))
        
        server(start, 3001)
    }
    "Should support side-effects"(){
        const start = obs()
            , sendAnalyticsToCustom = $ => {}
            , sendAnalyticsToGoogle = $ => {}

        start
        .then(context => sendAnalyticsToCustom(context))
        .then(context => sendAnalyticsToGoogle(context))

        server(start, 3002)
    }
    "Should support checks for session data"(){
        const start = obs()
            , redis = {get: (x:any, y:any): any => 1 }

        // async (check for login?)
        let [isLoggedIn, isAnonymous] =
            start
            .maybe(context => 
                new Promise((res, rej) =>
                    redis.get(
                        context.req.cookie.sesssionId
                        , (err, val) => err && rej(context) || res(context))))

        isLoggedIn
            .map(get('/account', ({send}) => send('your account')))

        isAnonymous
            .then(context => context.res.redirect('/login'))

        server(start, 3003)
    }
}