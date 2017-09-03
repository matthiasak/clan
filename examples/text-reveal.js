// try with arbiter: https://matthiasak.github.io/arbiter-frame
// https://goo.gl/s1nzKl
document.head.innerHTML += `<style>
@keyframes fadeUp {
    0% { opacity: 0; transform: translateY(2rem); }
    100% { opacity: 1; transform: translateY(0); }
}

body {
    text-align: justify;
}

.reveal {
    color: white;
    margin: .3em .25em;
    display: inline-block;
    font-size: 4rem;
    line-height: 100%;
    position: relative;
    animation: fadeUp .5s ease both;
    animation-play-state: paused;
}
.reveal::after {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    background-color: red;
    content: '';
    top: 0;
    right: 0;
    transition: width .5s ease;
}
.reveal.active {
    animation-play-state: running;
}
.reveal.active::after {
    width: 0;
}
</style>`

const app = () => {

    const {model, hamt, obs, worker, cof, cob, curry, batch, c, concatter, filtering, mapping, pf, rAF, vdom} = clanFp,
          {m, mount, update, qs} = vdom

    const span = (w,i) => {
        let config = el => {
            setTimeout(() => el.className += ' active', 500*i*.5)
        }

        return m('span.reveal', {config, ontransitionend: log}, w)
    }

    const textReveal = (words) => {
        return m('.div', words.map(span))
    }

    const poem = `The clearest way into the Universe is through a forest wilderness. --John Muir`

    mount(textReveal(poem.replace(/\s+/g, ' ').split(' ')), qs())
}

require('clan-fp').then(app)