let header = document.createElement('div')
header.setAttribute('class', 'pageHeader')
document.getElementById('body').prepend(header)

let footer = document.createElement('div')
footer.setAttribute('class', 'footer')

// copyright current year
let d = new Date().getFullYear()
let a = document.createElement('a')
a.innerHTML = 'github.com/HP4k15/iexCharts'
a.setAttribute('href', '')
let dt = (`<br>\r\u00A9 ${d} tout coule | source code available on <a href='https://github.com/HP4k1h5/iexCharts'>github.com/HP4k1h5/iexCharts</a>`)
// attribution
let attr = `Data provided for free by <a href='https://iextrading.com/developer'>IEX</a>. View IEX’s <a href='https://iextrading.com/api-exhibit-a/'>Terms of Use</a>.`

footer.innerHTML = attr + dt

document.getElementById('body').appendChild(footer)
