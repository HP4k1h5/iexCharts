let mktDiv = document.createElement('div')
mktDiv.setAttribute('class', 'market')
mktDiv.id = 'market'
document.getElementById('main').appendChild(mktDiv)

fetchMovers()

function fetchMovers(){
  let base = 'https://api.iextrading.com/1.0/stock/'
  //let base = 'https://api.iextrading.com/1.0/stock/market/list/'
  //let queries = ['losers', 'gainer']
  let queries = ['aapl', 'msft']
  function moverCalls(){
    return queries.map(q => {
      return new Promise((res, rej) =>
        res(fetch(base + q))
      )
    })
  }
  let promises = moverCalls()
  console.log(promises)
  Promise.all(promises).then(p =>
    console.log(p.json())
  )
}
