let header = document.createElement('header')
header.setAttribute('class', 'pageHeader')
document.getElementById('body').prepend(header)

let footer = document.createElement('footer')
footer.setAttribute('class', 'footer')

// attribution
let attr = `Data provided for free by <a href='https://iextrading.com/developer'>IEX</a>. View IEX’s <a href='https://iextrading.com/api-exhibit-a/'>Terms of Use</a>.`
// copyright current year
let dt = (`<br>\r\u00A9 ${new Date().getFullYear()} tout coule | source code available on <a href='https://github.com/HP4k1h5/iexCharts'>github.com/HP4k1h5/iexCharts</a>`)

footer.innerHTML = attr + dt
document.getElementById('body').appendChild(footer)
