function fetchChart(meta){
  let data = getData(meta)
    .then(d => treatData(d, meta))
    .then(d => cleanDiv(d, meta.box))
    .then(d => makeCharts(d, meta))
    .then(m => getQuote(m))
    .then(q => treatQuote(q, meta))
}

function getQuote(meta){
  let quote = meta.box.getElementsByClassName('quote')[0]
  while (quote.firstChild){
    quote.removeChild(quote.firstChild)
  }
  meta.makeUrl('quote')
  return fetch(meta.url).then(resp => resp.json())
}

function cleanDiv(d, box){
  let svgs = box.getElementsByTagName('svg')
  while (svgs[0]){
    svgs[0].parentNode.removeChild(svgs[0])
  }
  let wS = box.getElementsByClassName('waiting')
  wS[0] ? wS[0].parentNode.removeChild(wS[0])
    : null
  let news = box.getElementsByClassName('news')[0]
  news ? news.parentNode.removeChild(news)
    : null
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
  let hL = () => `${meta.low}::${meta.high}`
  let hLT = document.createTextNode(hL())
  qB[0].appendChild(hLT)
  Object.keys(vals).forEach(v => {
    let li = document.createElement('li')
    let txt = `${v} :: ${vals[v]}`
    let txtNode = document.createTextNode(txt)
    li.appendChild(txtNode)
    ul.appendChild(li)
  })
  qB[0].appendChild(ul)
  meta.wait = false
}

function getData(meta){
  waiting(meta)
  return fetch(meta.url)
    .then(resp => {
      return resp.headers.get('content-type')
        .indexOf('application/json') !== -1 
        && resp.ok
        ? resp.json() 
        : '' + resp.statusText
    })
    .catch(err => { console.error('fetch err: ', err)})
}

function treatData(data, meta){
  cleanDiv(null, meta.box)
  if (typeof data === 'string'){
    let span = document.createElement('span')
    span.setAttribute('class', 'err') 
    let txt = document.createTextNode(meta.url + ': ' + data)
    span.appendChild(txt)
    meta.box.appendChild(span) 
    throw new Error(meta.url, data)
  }
  else{
    let err = document.getElementsByClassName('err')[0]
    while (err){
      err.parentNode.removeChild(err)
    }
  }

  let valObj = {
    line: ['close', 'volume'],
    bars: ['close', 'volume'],
    OHLC: ['open', 'high', 'low', 'close', 'volume'],
    hilo: ['high', 'low', 'volume']
  }
  let valArr = valObj[meta.type]
    .map(v => Object.keys(data)
      .map(d => data[d][v])
      .filter(i => i > 0))
  meta.high = Math.max(...valArr[0])
  meta.low = Math.min(...valArr[0])
  valArr = valArr.map(z => zeroVal(z))
  function zeroVal(arr){
    let lo = Math.min(...arr)
    return arr.map(v => v - lo) 
  }
  return valArr
}
