let mktDiv = document.createElement('div')
mktDiv.setAttribute('class', 'market')
document.getElementById('main').appendChild(mktDiv)
let divTitle = document.createTextNode('Gainers/Losers')
mktDiv.appendChild(divTitle)
fetchMovers()
setInterval(fetchMovers, 10000)

function fetchMovers(){
  let base = 'https://api.iextrading.com/1.0/stock/market/list/'
  let queries = ['losers', 'gainers']

  Promise.all(queries.map(q => 
    fetch(base + q))).then(resp =>
      Promise.all(resp.map(res => 
        res.json()
      ))
  ).then(r => {
    let uls = mktDiv.getElementsByTagName('ul')
    while (uls[0]){
      uls[0].parentNode.removeChild(uls[0])
    }
  
    let ul = document.createElement('ul')
    r.forEach(o => { 
      o.forEach(p => {
        let li = document.createElement('li')
        let txt = `${p.symbol}: ${(p.changePercent*100).toFixed(2)}%`
        txt = document.createTextNode(txt)
        li.appendChild(txt)
        p.change >= 0 ? 
          li.setAttribute('class', 'green')
          : li.setAttribute('class', 'red')
        ul.appendChild(li)
      })
      mktDiv.appendChild(ul)
    })
  })
}
