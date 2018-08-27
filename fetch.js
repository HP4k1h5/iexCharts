function fetchChart(meta){
  let data = getData(meta)
    .then(d => treatData(d, meta))
    //.then(d => cleanDiv(d, meta.box))
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

function treatQuote(q, meta){
  let ul = document.createElement('ul')
  let vals = {
    'companyName': q.companyName,
    'delayedPrice': q.delayedPrice,
    'change' : q.change,
    'changePercent': q.changePercent,
    'open': q.open,
    'close': q.close,
    'high': q.high,
    'low': q.low,
    'latestVolume': q.latestVolume,
    'avgTotalVolume': q.avgTotalVolume,
    'peRatio': q.peRatio
  }
  function color(v, li){
    v >= 0 
      ? li.setAttribute('class', 'green')
      : li.setAttribute('class', 'red')
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
    if (v === 'change' 
      || v === 'changePercent'
    ){
      color(vals[v], li)
    }
    if (v === 'delayedPrice'){
      color(vals['change'], li)
    }
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
    .catch(err => {
      meta.wait = false
      let span = document.createElement('span')
      span.setAttribute('class', 'err')
      let txt = document.createTextNode('getData err: ' + err.message)
      span.appendChild(txt)
      meta.box.appendChild(span)
      console.error('fetch err: ', err)
    })
}

function treatData(data, meta){
  let valObj = {
    line: ['close', 'volume'],
    bars: ['close', 'volume'],
    OHLC: ['open', 'high', 'low', 'close', 'volume'],
    hilo: ['low', 'high', 'volume']
  }
  if (typeof data === 'string' || ! data){
    meta.wait = false
    let span = document.createElement('span')
    span.setAttribute('class', 'err') 
    let txt = document.createTextNode(`no Data: data= ${data}`)
    span.appendChild(txt)
    meta.box.insertBefore(span, meta.box.nextSibling) 
    throw new Error(`tretatData err: data=${data}`)
  } 

  if (! valObj[meta.type]){
    meta.wait = false
    cleanDiv(null, meta.box)
    let span = document.createElement('span')
    span.setAttribute('class', 'err') 
    let txt = document.createTextNode(
    `invalid chart type: ${meta.type}
      :: VALID types: #bars #line #hilo`
    )
    span.appendChild(txt)
    //meta.box.insertBefore(span, meta.box.firstChild) 
    meta.box.insertBefore(span, meta.box.firstChild.nextSibling) 
    throw new Error('invalid chart type', meta.type)
  } 

  let valArr = valObj[meta.type]
    .map(v => Object.keys(data)
      .map(d => data[d][v])
      .filter(i => i > 0))
  meta.high = Math.max(...valArr[0])
  meta.low = Math.min(...valArr[0])
  meta.open = valArr[0][0]
  meta.close = valArr[0][valArr.length - 1]
  valArr = valArr.map(z => zeroVal(z))
  function zeroVal(arr){
    return arr.map(v => v - meta.low) 
  }
  return valArr
}
