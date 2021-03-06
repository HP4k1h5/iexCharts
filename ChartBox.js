function createBox(meta){
  meta.setId().makeUrl()
  makeBox(meta)
}
//initializes page with one chart box
createBox(new Meta())

function makeBox(meta){
  let box = document.createElement('div')
  box.id = meta.id 
  box.setAttribute('class', 'chartWindow')
  box.style = `width: ${meta.size.width}`
  box.appendChild(makeTitle(meta))
  box.appendChild(makeQuoteDiv())
  box.getElementsByClassName('chartHeader')[0]
    .appendChild(makeInput(meta.id))
  document.getElementById('main').appendChild(box)
  meta.box = box
  fetchChart(meta)
}

function reBox(meta){
  meta.box.style = `width: ${meta.size.width}`
  meta.makeUrl()
  meta.box.getElementsByClassName('chartTitle')[0].textContent = `\$${meta.sec}:${meta.time}`
  fetchChart(meta)
}

function makeTitle(meta){
  let div = document.createElement('div')
  div.setAttribute('class', 'chartHeader')
  let span = document.createElement('span')
  span.setAttribute('class', 'chartTitle')
  let txt = document.createTextNode(`\$${meta.sec}:${meta.time}`)
  span.appendChild(txt)
  div.appendChild(span)
  return div
}

function makeQuoteDiv(){
  let div = document.createElement('div')
  div.setAttribute('class', 'quote')
  return div
}

function makeInput(id){
  let inputField = document.createElement('input')
  inputField.id = 'input'
  inputField.setAttribute('class', 'in')
  inputField.addEventListener('keypress', e => {
    if (e.key === 'Enter'){
      handleReq(inputField.value, id)
      inputField.value = ''
      inputField.autofocus = true
    }
  })
  return inputField
}

function fetchNews(meta){
  cleanDiv(null, meta.box)
  let newsDiv = document.createElement('div')
  newsDiv.setAttribute('class', 'news')
  newsDiv.id = 'news'
  meta.box.appendChild(newsDiv)
  meta.makeUrl('news')
  fetch(meta.url)
    .then(j => j.json())
    .then(d => {
      let txt = d.reduce((a,n) => 
        a + '<hr>' + n.datetime.slice(0,16) + ': ' + n.source
        + '<br><b>' + n.headline + '</b>' 
        + '<br>' + n.summary + ':' 
        + '<a href=' + n.url + '>' + 'link' + '</a>' 
        , '')
      newsDiv.innerHTML = txt
    })
}

function handleReq(val, id){
let meta = metaArr.find(m => m.id === id)
meta = /\bnew\b/.test(val)
  ? new Meta(meta.sec, meta.time, meta.type, meta.size.width)
  : meta
if (/\bclose\b/.test(val)){
  meta.deleteMe(meta)
  return
}
if (/\bhelp\b/.test(val)){
  showHelp(meta)
  return
}

if (/\$\w+/.test(val)){
  meta.sec = val.match(/\$([\w.]+)/)[1]
}
if (/\:\w+/.test(val)){
  meta.time = val.match(/\:([\w/\d]+)/)[1]
}
if (/#\w+/.test(val)){
  meta.type = val.match(/#(\w+)/)[1].toLowerCase()
}
if (/\b(sm|lg)\b/.test(val)){
  let m =val.match(/\b(sm|lg)\b/)[0].toLowerCase()
  meta.size.width = (m === 'lg') 
    ? '80%'
    : '40%'
}

if (/\!/.test(val)){
  fetchNews(meta)
  return 
}
if (/\//.test(val)){
  getSymbols(val.match(/\/(\w+)/)[1], meta)
}

/\bnew\b/.test(val) 
  ? createBox(meta)
  : reBox(meta)
}
