function waiting(meta){
  meta.wait = true
  let waitSpan = document.createElement('span')
  waitSpan.setAttribute('class', 'waiting')
  meta.box.appendChild(waitSpan)
  let i = 0
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

  let interval = setInterval(wait, 500)
  function wait(){
  let bftxt = document.createTextNode(backForth())
    meta.wait 
      ? (waitSpan.innerHTML = '',
        waitSpan.appendChild(bftxt))
      : window.clearInterval(interval)
  }
}
