function fetchChart(meta){
  let data = getData(meta.url)
    .then(d => treatData(d, meta))
    .then(d => cleanDiv(d, meta.box))
    .then(d => makeCharts(d, meta))
    .then(d => getQuote(meta))
}

function getQuote(meta){
  let quote = meta.box.getElementsByClassName('quote')[0]
    quote.childNodes.forEach(c => {
    quote.removeChild(c)
  })
  meta.makeUrl(true)
  fetch(meta.url).then(resp => resp.json())
    .then(q => treatQuote(q, meta))
}

function cleanDiv(d, box){
  let svgs = box.getElementsByTagName('svg')
  while (svgs[0]){
    svgs[0].parentNode.removeChild(svgs[0])
  }
  return d
}

function treatQuote(q, meta){
  let ul = document.createElement('ul')
  let vals = {
    'companyName': q.companyName,
    'delayedPrice': q.delayedPrice,
    'open': q.open,
    'close': q.close,
    'low': q.low,
    'high': q.high
  }
  let qB = meta.box.getElementsByClassName('quote')
  console.log( meta.low)
  let hL = `${meta.low}:${meta.high}`
  hL = document.createTextNode(hL)
  qB[0].appendChild(hL)
  Object.keys(vals).forEach(v => {
    let li = document.createElement('li')
    let txt = `${v} :: ${vals[v]}`
    let txtNode = document.createTextNode(txt)
    li.appendChild(txtNode)
    ul.appendChild(li)
  })
  qB[0].appendChild(ul)
}

function getData(url){
  return fetch(url)
    .then(resp => resp.json())
    .catch(err => console.error('fetch err: ', err))
}

function treatData(data, meta){
  let valObj = {
    line: ['close', 'volume'],
    bars: ['close', 'volume'],
    OHLC: ['open', 'high', 'low', 'close', 'volume'],
    hiLo: ['high', 'low', 'volume']
  }
  let valArr = valObj[meta.type]
    .map(v => Object.keys(data)
      .map(d => data[d][v])
      .filter(i => i))
  meta.high = Math.max(...valArr[0])
  meta.low = Math.min(...valArr[0])
  valArr = valArr.map(z => zeroVal(z))
  function zeroVal(arr){
    let lo = Math.min(...arr)
    return arr.map(v => v - lo) 
  }
  return valArr
}
