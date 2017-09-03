// try in arbiter: https://goo.gl/3qbYJE
document.head.innerHTML = `<style>
.preload {
    opacity: 0;
    min-height: 400px;
    background-size: cover;
    background-position: center;
    transition: opacity .25s ease;
}
.loaded {
    opacity: 1;
}
</style>`

const app = () => {
    const {vdom, model, hamt, obs, mixin, c, cob, cof, concatter, curry, mapping, filtering, pf} =
          clanFp,
          {m, html, qs, mount, update} = vdom

    /**
     * load an image in JS, and then animate it in as a background image
     *
     * lazy(url, m('div'))
     */
    const lazy = (url, comp) => {
        let x = comp,
            image,
            loaded = false

        while(x instanceof Function)
            x = x()

        const imgConfig = el => {
            image = new Image()

            el.style.backgroundImage = `url(${url})`

            const done = ev => {
                if(loaded) return
                el.className += ' loaded'
                loaded = true
            }

            image.onload = done
            image.src = url
        }

        x.config = imgConfig
        return x
    }

    let app = () => [
        'https://media2.giphy.com/media/3o7TKIyZgIr2SMOyEo/200w.gif#0',
        'https://media2.giphy.com/media/3o6Zth4Kv2kNZgvSmI/200w.gif#39',
        'https://media3.giphy.com/media/l0MYGQZjd8yb5O30k/200.gif#60'
    ].map(x => lazy(x, m('.preload')))

    mount(app, qs())
}

require('clan-fp').then(app)