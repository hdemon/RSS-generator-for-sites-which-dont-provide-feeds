const request = require('request')
const { JSDOM } = require('jsdom')

const options = {
    url: 'https://pc.watch.impress.co.jp/docs/column/kaigai/'
}

const callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
        const dom = new JSDOM(body)
        const entries = Array.from(dom.window.document.querySelectorAll('.item.column.kaigai'))
            .map(e => ({
                title: e.querySelectorAll('a')[1].innerHTML,
                link: e.querySelectorAll('a')[0].href,
                date: new Date(e.querySelector('.date').innerHTML.slice(0, -1).substr(1)).toISOString(),
                description: e.querySelectorAll('a')[1].innerHTML,
            }))
        const items = entries.map(entry => getItem(entry)).join('')
        const feed = getFeed(items)
        console.log(feed)
    }
}

const getFeed = (items) => `
<channel>
    <title>後藤弘茂のWeekly海外ニュース</title>
    <link>https://pc.watch.impress.co.jp/docs/column/kaigai/</link>
    <description>後藤弘茂のWeekly海外ニュース</description>
    ${items}
</channel>
`

const getItem = ({ title, link, date, description }) => `
    <item rdf:about="https://akiba-pc.watch.impress.co.jp/docs/sale/1141965.html?ref=rss">
        <title>${title}</title>
        <link>${link}</link>
        <dc:date>${date}</dc:date>
        <description>
            <![CDATA[${description}]]>
        </description>
    </item>
`

request(options, callback)
