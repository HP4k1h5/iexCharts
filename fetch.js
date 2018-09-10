function fetchChart(meta){
  let data = getData(meta)
    .then(d => treatData(d, meta))
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
  let nameTxt = document.createTextNode(q.companyName)
  let compName = document.createElement('span')
  compName.setAttribute('class', 'compName')
  compName.appendChild(nameTxt)
  meta.box.getElementsByClassName('chartHeader')[0].appendChild(compName)
  let vals = {
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
  let hL = () => `h:${meta.high.toFixed(2)}\nl:${meta.low.toFixed(2)}\no:${meta.open}\nc:${meta.close}`
  let hLT = document.createTextNode(hL())
  qB[0].appendChild(hLT)

  let ul = document.createElement('ul')
  Object.keys(vals).forEach(v => {
    let li = document.createElement('li')
    let txt = `${v} :: ${vals[v]}`
    let txtNode = document.createTextNode(txt)
    li.appendChild(txtNode)
    if (v === 'change' || v === 'changePercent'){
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
  meta.box.getElementsByClassName('waiting').length === 0
  ? waiting(meta)
  : null

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
      meta.box.firstChild.nextSibling.appendChild(span)
      console.error('getData err: ', err)
    })
}

function treatData(data, meta){
  let valObj = {
    line: ['close', 'volume'],
    bars: ['close', 'volume'],
    ohlc: ['open', 'high', 'low', 'close', 'volume'],
    hilo: ['low', 'high', 'volume']
  }
  if (typeof data === 'string' || ! data){
    cleanDiv(null, meta.box)
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
    meta.box.insertBefore(span, meta.box.firstChild.nextSibling) 
    throw new Error('invalid chart type', meta.type)
  } 

  let valArr = valObj[meta.type]
    .map(v => Object.keys(data)
      .map(d => data[d][v])
      .filter(i => i > 0)
    )
  meta.high = Math.max(...valArr[0])
  meta.low = Math.min(...valArr[0])
  meta.open = valArr[0][0]
  meta.close = valArr[0][valArr.length - 1]
  valArr[0] = valArr[0].map(z => z - meta.low)
  if (valArr.length === 3){
    valArr[1] = valArr[1].map(z => z - meta.low)
  }
  return valArr
}
