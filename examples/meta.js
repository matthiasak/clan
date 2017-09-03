// More info: https://developer.chrome.com/multidevice/android/installtohomescreen
// Facebook: https://developers.facebook.com/docs/sharing/webmasters#markup
// Open Graph: http://ogp.me/
// More info: https://dev.twitter.com/cards/getting-started
// Validate: https://dev.twitter.com/docs/cards/validation/validator
// More info: https://developer.apple.com/safari/library/documentation/appleapplications/reference/safarihtmlref/articles/metatags.html
const meta = ({
    theme='black'
    , site_name
    , title=''
    , summary
    , img='icon'
    , url
    , manifest='manifest'
    , author
    , css = '/style.css'
    , social: { cover_image }
    , mobile: { app_name }
    , fb:{ fb_app_id, style='article'}
    , twitter: { site_twitter_account, individual_twitter_account }
    , google: { google_plus_page }
    , ios: { ios_app_id, affiliate_id, app_arg, telephone='yes' }
    , chrome: { chrome_app_id }
    , applinks: { android_pkg, docs_url }
}) => [
    m('meta', {charset:'utf8'}),
    m('meta', {'http-equiv':'x-ua-compatible', content:'ie=edge'}),
    m('meta', {name:'viewport', content:"width=device-width, initial-scale=1.0, shrink-to-fit=no"}),
    m('title', title),
    ...([
        'theme-color,'+theme,
        'msapplication-TileColor,'+theme,
        'HandheldFriendly,True',
        'MobileOptimized,320',
        'mobile-web-app-capable,yes',
        'apple-mobile-web-app-capable,yes',
        `apple-mobile-web-app-title,${title}`,
        `msapplication-TileImage,/${img}-144x144.png`,
        `msapplication-square70x70logo,/smalltile.png`,
        `msapplication-square150x150logo,/mediumtile.png`,
        `msapplication-wide310x150logo,/widetile.png`,
        `msapplication-square310x310logo,/largetile.png`,
        // twitter
        `twitter:card,${summary}`,
        `twitter:site,@${site_twitter_account}`,
        `twitter:creator,@${individual_twitter_account}`,
        `twitter:url,${url}`,
        `twitter:title,${title}`,
        `twitter:description,${summary}`,
        `twitter:image,${cover_image}`
        // iOS
        // Smart App Banner
        `apple-itunes-app,app-id=${ios_app_id},affiliate-data=${affiliate_id},app-argument=${app_arg}`,
        // Disable automatic detection and formatting of possible phone numbers -->
        `format-detection,telephone=${telephone}`,
        // Add to Home Screen
        `apple-mobile-web-app-capable,yes`,
        `apple-mobile-web-app-status-bar-style,black`,
        `apple-mobile-web-app-title,${title}`,
    ].map(x => m('meta', {name: x.split(',')[0], content: x.split(',')[1]}))),
    // ...([512,180,152,144,120,114,76,72].map(x =>
    //     m('link', {rel: 'apple-touch-icon-precomposed', sizes:`${x}x${x}`, href:`/${img}-${x}x${x}.png`}))),
    m('link', {rel: 'apple-touch-icon-precomposed', href:`/${img}-180x180.png`}),
    m('link', {rel: 'apple-touch-startup-image', href:`/${img}-startup.png`}),
    m('link', {rel: 'shortcut icon', href:`/${img}.ico`, type:'image/x-icon'}),
    m('link', {rel: 'manifest', href:`/${manifest}.json`}),
    [
        // fb opengraph
        `fb:app_id,${fb_app_id}`,
        `og:url,${url}`,
        `og:type,website`,
        `og:title,${title}`,
        `og:image,${cover_image}`,
        `og:description,${summary}`,
        `og:site_name,${site_name}`,
        `og:locale,en_US`,
        `article:author,${author}`,
        // applinks
        // // iOS
        `al:ios:url,applinks://docs`,
        `al:ios:app_store_id,${ios_app_id}`,
        `al:ios:app_name,${app_name}`,
        // Android
        `al:android:url,applinks://docs`,
        `al:android:app_name,${app_name}`,
        `al:android:package,${android_pkg}`,
        // Web Fallback
        `al:web:url,${docs_url}`,
        // More info: http://applinks.org/documentation/
    ].map((x,i,a,p=x.split(',')) => m('meta', {property:p[0], content:p[1]})),
    // fb
    m('meta', {property:"op:markup_version", content:"v1.0"}),
    m('link', {rel:"canonical", href:url}),
    m('meta', {property:"fb:article_style", content:style}),
    // google+
    m('link', {href:`https://plus.google.com/+${google_plus_page}`, rel:'publisher'}),
    m('meta', {itemprop:"name", content:title}),
    m('meta', {itemprop:"description", content:summary}),
    m('meta', {itemprop:"image", content:cover_image}),
    // Pinned Site - Safari
    m('link', {rel:"mask-icon", href:`${img}.svg`, theme})
    // chrome web store
    m('link', {rel:"chrome-webstore-item", href:`https://chrome.google.com/webstore/detail/${chrome_app_id}`}),
    // Disable translation prompt
    m('meta', {name:'google', value:'notranslate'}),
    // css!
    m('link', {type:'text/css', rel:'stylesheet', href:css})
]

/**
 * Google Analytics
 */
const googleAnalytics = id => {
    const x = () => {
        window.ga = window.ga || function(){
            window.ga.q = (window.ga.q || []).push(arguments)
        }
        let ga = window.ga
        ga('create', id, 'auto')
        ga('send', 'pageview')
    }
    return m('script', {config: x, src:'https://www.google-analytics.com/analytics.js', l: 1 * new Date, async: 1})
}

