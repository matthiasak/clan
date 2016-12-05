// copy and paste into https://matthiasak.github.io/arbiter-frame/

document.head.innerHTML += `<style>
body {
	background-color: #efefef;
}
*, *:before, *:after {
	box-sizing: border-box;
}
.messenger {
	min-height: 100vh;
	position: relative;
    padding: 1rem;
}
.messenger form {
	position: fixed;
	bottom: 0;
	left: 0;
	background: #efefef;
	right: 0;
	padding: 3rem 1rem;
}
.messenger form input {
	display: inline-block;
	width: 100%;
    padding: 1rem;
	box-shadow: 0 .5rem 3rem #aaa;
    border: none;
}
.messages {
	position: absolute;
	bottom: 9.5rem;
	left: 1rem;
	right: 1rem;
	text-wrap: word;
}
.message {
    padding: 1rem;
    position: relative;
	animation: fadeUp 1s .1s ease both;
    word-wrap: break-word;
}
.bot {
    margin: 2.5rem 43% 0 2.5rem;
    background-color: #aaa;
    border-radius: 0 1rem 1rem 1rem;
}
.bot::before {
	content: ':-)';
	display: block;
	padding: 0 1rem 0 0;
	position: absolute;
	top: 0;
	right: 100%;
}
.self {
	background-color: lightblue;
    border-radius: 1rem 0 1rem 1rem;
	text-align: right;
    margin: 2.5rem 2.5rem 0 43%;
}
.self::before {
	content: '(-:';
	display: block;
	padding: 0 0 0 1rem;
	position: absolute;
	top: 0;
	left: 100%;
}
@keyframes fadeUp {
	0% { opacity: 0; transform: translateY(2rem); }
    100% { opacity: 1; transform: translateY(0); }
}
</style>`

const app = () => {
    const {vdom, model, obs, hamt, c, cof, cob, pf, rAF, batch, concatter, mapping, filtering, mixin} = clanFp
    	, {m, mount, update, qs, container} = vdom
    	, questions = [
			{text: r => `Hi!, What is your name?`, val: 'name'}
            , {text: r => `Thanks, ${r.name}. How old are you?`, val: 'age'}
            , {text: r => `Awesome, and your email address so we can say "hi" on occasion?`, val: 'email'}
            , {text: r => `That's all we need. Thanks!`}
        ]

    const messenger = () => {
        const pipe = obs([])
        	, q = obs([])
        	, a = obs()
            , typing = obs()

			, toMessage = ({isSelf, text}) =>
        		m(`.message${isSelf ? '.self' : '.bot'}`, text)
        	, getText = () => qs('.messenger form input').value
            , clearText = () => {
                let i = qs('.messenger form input')
                i && (i.value = '')
            }

        	, ques = () => questions[Object.keys(as()).length]
        	, prompt = () => ques().text(as())
        	, setNextPrompt = () => {

            }
        	, onsubmit = e => {
                e.preventDefault()
                a({isSelf: true, text:getText()})
            }

        const as =
        	a
        	.filter(x => x.text.trim() !== '')
            .debounce(500)
        	.then(x => pipe(x))
        	.then(x => setTimeout(x => q({text: prompt()}), 2000))
        	.reduce((acc,v) => {
                let q = ques()
                return {...acc, [q.val]: v.text}
            })
            .then(clearText)

        as({})


        q
        	.then(x => pipe(x))

        const messages =
            pipe
        	.reduce((acc,v) => [...acc, v], [])
        	.then(update)

        q({text: prompt()})

        return () => m('.messenger'
            , m('.messages'
                , messages().map(toMessage))
			, m('form'
                , { onsubmit }
				, m('input'
					, {
            			placeholder: 'Type your answer here ...'
            			, onchange: typing
        			  })))
    }

    mount(messenger(), qs())
}


require('clan-fp').then(app).catch(e => log(e+''))