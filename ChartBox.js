function createBox(sec, time, type){
  let meta = new Meta(sec, time, type)
  meta.setId().makeUrl()
  makeBox(meta)
}
createBox()

function makeBox(meta){
  let box = document.createElement('div')
  box.id = meta.id 
  box.setAttribute('class', 'chartWindow')
  box.appendChild(makeTitle(meta))
  box.appendChild(makeQuoteDiv())
  box.appendChild(makeInput(meta.id))
  document.getElementById('main').appendChild(box)
  meta.box = box
  fetchChart(meta)
}

function reBox(meta){
  meta.makeUrl()
  meta.box.childNodes[0].textContent = `\$${meta.sec} : ${meta.time}`
  fetchChart(meta)
}

function makeTitle(meta){
  let p = document.createElement('span')
  p.setAttribute('class', 'chartTitle')
  let txt = document.createTextNode(`\$${meta.sec} : ${meta.time}`)
  p.appendChild(txt)
  return p
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
  meta.box.childNodes[0].textContent = `!${meta.sec} : NEWS!!`
  let br = document.createElement('br')
  let newsDiv = document.createElement('div')
  newsDiv.setAttribute('class', 'news')
  newsDiv.id = 'news'
  meta.box.appendChild(newsDiv)
  meta.makeUrl('news')
  fetch(meta.url)
    .then(j => j.json())
    .then(d => {
      let txt = d.reduce((a,n) => 
        a + n.datetime.slice(0,16) + ': ' 
        + '<b>' + n.headline + '</b>' 
        + '<br>' + n.summary + ':' 
        + '<a href=' + n.url + '>' + 'link' + '</a>' 
        + '<br>' + '•••'
        , '')
      newsDiv.innerHTML = txt
    })
}

function handleReq(val, id){
  let meta = metaArr.find(m => m.id === id)
  meta = /\bnew\b/.test(val)
    ? new Meta(meta.sec, meta.time, meta.type)
    : meta
  if (/\bclose\b/.test(val)){
    meta.deleteMe(meta)
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
  if (/\!/.test(val)){
    fetchNews(meta)
    return 
  }

  /\bnew\b/.test(val) 
    ? createBox(meta.sec, meta.time, meta.type)
    : reBox(meta)
}
