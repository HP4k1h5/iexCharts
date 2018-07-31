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
  meta.box.childNodes[0].textContent = `${meta.sec} : ${meta.time}`
  fetchChart(meta)
}

function makeTitle(meta){
  let p = document.createElement('span')
  p.class = 'chartTitle' 
  let txt = document.createTextNode(`${meta.sec} : ${meta.time}`)
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
  inputField.addEventListener('keypress', e => {
    if (e.key === 'Enter'){
      handleReq(inputField.value, id)
      inputField.value = ''
    }
  })
  return inputField
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
    meta.sec = val.match(/\$(\w+)/)[1]
  }
  if (/\:\w+/.test(val)){
    meta.time = val.match(/\:(\w+)/)[1]
  }
  if (/#\w+/.test(val)){
    meta.type = val.match(/#(\w+)/)[1]
  }

  /\bnew\b/.test(val) 
    ? createBox(meta.sec, meta.time, meta.type)
    : reBox(meta)
}
