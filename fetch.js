function fetchChart(meta){
  let data = getData(meta)
    .then(d => treatData(d, meta))
    .then(d => cleanDiv(d, meta.box))
    .then(d => makeCharts(d, meta))
    .then(m => getQuote(m))
    .then(q => treatQuote(q, meta))
}

function waiting(meta){
  meta.wait = true
  document.getElementById('input').setAttribute('class', 'waiting')
  let i =0
  let dir = 0
  function backForth(){
    let l = 5
    let dot = '•'
    let cursor = '|'
    let line = ''

    function forward(){
      while (i%l < l && line.length <= l-1){
        if (i % l === line.length){
          line += cursor
        }
        else{
          line += dot
        }
      }
      i++
      return line
    } 

    function backward(){
      while (i%l < l+1 && line.length <= l-1){
        if (l-1 - (i%l) === line.length){
          line += cursor
        }
        else {
          line += dot
        }
      }
      i++
      return line
    }

    if (dir === 0){
      if (i%l === l-1){
        dir = 1
      }
      return forward()
    }
    else{
      if (i%l === l-1){
        dir = 0
      }
      return backward()
    }
  }

  let interval 
  interval = setInterval(wait(), 100)
  function wait(){
     meta.wait 
      ? document.getElementById('input').value = backForth()
      : window.clearInterval(interval)
  }
}

function getQuote(meta){
  let quote = meta.box.getElementsByClassName('quote')[0]
  while (quote.firstChild){
    quote.removeChild(quote.firstChild)
  }
  meta.makeUrl(true)
  return fetch(meta.url).then(resp => resp.json())
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
}

function getData(meta){
  waiting(meta)
  return fetch(meta.url)
    .then(resp => {
      console.log( resp.ok)
      return resp.headers.get('content-type').indexOf('application/json') !== -1 && resp.ok
        ? resp.json() 
        : '' + resp.statusText
    })
    .catch(err =>{ console.error('fetch err: ', err)})
}

function treatData(data, meta){
  if (typeof data === 'string'){
    console.error( 'treatData err:', data)
    return 
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

  meta.wait = false
  document.getElementById('input').setAttribute('class', 'in')
  document.getElementById('input').value = ''
  return valArr
}
