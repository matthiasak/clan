// try with arbiter: https://matthiasak.github.io/arbiter-frame
// https://goo.gl/LnaEaq
const app = () => {
    const {vdom, model, hamt, obs, mixin, c, cob, cof, concatter, curry, mapping, filtering, pf} =
          clanFp,
          {m, component, update, mount, qs} = vdom

    const vh = () =>
        "innerHeight" in window
            ? window.innerHeight
            : document.documentElement.offsetHeight;

    const wh = obs.from(push =>
        window.addEventListener('resize', e => push(vh())))
        .debounce(16)

    const scrollmon = obs.from(push => window.addEventListener('scroll', e => push(1)))
        .debounce(16)
        .map(x => window.scrollY)
        .debounce(16)
        .then(update)

    const section = (i) => {
        let style = {
            'background-color': 'green',
            padding: '30px 1.5rem',
            opacity: 0,
            transition: 'all .25s ease'
        }

        let el,
            mon = scrollmon
                .map(x => {
                    if(!el) return false
                    let {top} = el.getBoundingClientRect()
                    return top < wh() && top > -100
                })
                .then(visible => {
                    style.opacity = visible ? 1 : 0
                })

        const config = (_el) => {
            el = _el
            scrollmon(0)
        }

        return curry(m, 'div', {style, config}, i)
    }

    const draw = () => m('div',
        Array(100).fill(1).map((x,i) => section(i+'')))

    mount(draw(), qs())
    wh(vh())
    scrollmon(0)
}

document.head.innerHTML += `<style>
html, body {
    height: auto;
    overflow-y: auto;
}
</style>`

require('clan-fp').then(app)