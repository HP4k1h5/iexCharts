function cleanDiv(d, box){
  let svgs = box.getElementsByTagName('svg')
  while (svgs[0]){
    svgs[0].parentNode.removeChild(svgs[0])
  }
  let wS = box.getElementsByClassName('waiting')
  while (wS[0]){
    wS[0].parentNode.removeChild(wS[0])
  }
  let news = box.getElementsByClassName('news')
  while (news[0]){
    news[0].parentNode.removeChild(news[0])
  }
  let err = box.getElementsByClassName('err')
  while (err[0]){
    err[0].parentNode.removeChild(err[0])
  }
  let res = box.getElementsByClassName('results')
  while(res[0]){
    res[0].parentNode.removeChild(res[0])
  }
  let help = box.getElementsByClassName('help')
  while(help[0]){
    help[0].parentNode.removeChild(help[0])
  }
  return d
}

function showHelp(meta){
  cleanDiv(null, meta.box)
  let helpDiv = document.createElement('div')
  helpDiv.setAttribute('class', 'help')
  let helpText  = `Commands:
help - displays commands
new - opens a new terminal window with the same content as original, or new content if provided
close - closes the current terminal window
! - retrieves news
$stock - changes the current security
:time - [1d(default), 1m, 3m, 6m, ytd, 1y, 2y, 5y]
#type - chart type [bars, line, hiLo, (OHLC soon)]
/searchTerm - returns possible matches with ticker symbols`.split('\n')
  let ul = document.createElement('ul')
  helpText.forEach(t => {
    let li = document.createElement('li')
    t = document.createTextNode(t)
    li.appendChild(t)
    ul.appendChild(li)
  })
  helpDiv.appendChild(ul)
  meta.box.appendChild(helpDiv)
}

function  findDiff(term, txt){
  let i = 0
  let letters = term.split('')
    .map(l => {
      let m = txt.match(new RegExp(l, 'i'))
      return m
    })
    .filter(l => l)
  let firstInd = letters[0] ? letters[0].index : null
  letters = letters.map((l,i) => {
    let diff = i - (l.index - firstInd)
    return [diff, l]
  })
  if (letters.length > 0){
    let diff = letters.map(l => Math.abs(l[0]))
      .reduce((a,v) => {
      v = v < 2
        ? 10 - v
        : - v
      return a+v
    }, 0)
    let l = letters[0][1]['input']
    return [diff, l]
  }
}

function getSymbols(term, meta){
  fetch('https://api.iextrading.com/1.0/ref-data/symbols')
    .then(data => data.json())
    .then(j => {
      let possibles = []
      j.forEach(function(a){
        let p = findDiff(term, a.name)
        p ? possibles.push([p[0], p[1], a.symbol])
          : null
      })
      possibles = possibles.sort((a,b) => b[0] - a[0])
      return possibles.slice(0,20)
    })
    .then(d => showResults(d, meta))
}

function showResults(rs, meta){
  cleanDiv(null, meta.box)
  let div = document.createElement('div')
  div.setAttribute('class', 'results')
  let ul = document.createElement('ul')
  rs.forEach(res => {
    let li = document.createElement('li')
    let txt = `${res[1]} : ${res[2]}`
    txt = document.createTextNode(txt)
    li.appendChild(txt)
    ul.appendChild(li)
  })
  div.appendChild(ul)
  meta.box.appendChild(div)
}

function waiting(meta){
  meta.wait = true
  let waitSpan = document.createElement('span')
  waitSpan.setAttribute('class', 'waiting')
  meta.box.getElementsByClassName('chartHeader')[0].appendChild(waitSpan)
  let i = 0
  let dir = 0
  function backForth(){
    let l = 5
    let dot = '•'
    let cursor = '|'
    let line = ''
    function forward(){
      while (i%l < l && line.length <= l-1){
        if (i % l === line.length) line += cursor
        else line += dot
      }
      i++
      return line
    } 
    function backward(){
      while (i%l < l+1 && line.length <= l-1){
        if (l-1 - (i%l) === line.length) line += cursor
        else line += dot
      }
      i++
      return line
    }

    if (dir === 0){
      if (i%l === l-1)  dir = 1
      return forward()
    }
    else{
      if (i%l === l-1) dir = 0
      return backward()
    }
  }

  let interval = setInterval(wait, 80)
  
  // let intTimer = 0

  meta.box.getElementsByClassName('chartHeader')[0].appendChild(waitSpan)
  function wait(){
  // wait info 
  // console.log( 'wait meta.wait', meta.wait)
  // console.log( intTimer++)
    let bftxt = backForth()
    if (meta.wait){
      waitSpan.innerHTML = bftxt
    }
    else{
      let waits = meta.box.getElementsByClassName('waiting')
      while(waits[0]){
        waits[0].parentNode.removeChild(waits[0])
      }
      window.clearInterval(interval)
    } 
  }
}
