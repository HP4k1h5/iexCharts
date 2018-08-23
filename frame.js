let header = document.createElement('div')
header.setAttribute('class', 'pageHeader')
document.getElementById('body').appendChild(header)

let footer = document.createElement('div')
footer.setAttribute('class', 'footer')

// copyright current year
let d = new Date().getFullYear()
let dt = (`<br>\r\u00A9 ${d} tout coule`)
// attribution
let attr = `Data provided for free by <a href='https://iextrading.com/developer'>IEX</a>. View IEX’s <a href='https://iextrading.com/api-exhibit-a/'>Terms of Use</a>.`

footer.innerHTML = attr + dt

document.getElementById('body').appendChild(footer)
