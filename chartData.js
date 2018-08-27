function makeCharts(d, meta){
  cleanDiv(null, meta.box)
  let prices = makeSvg(d.slice(0,-1), meta.type, 'price', meta.box)
  meta.box.appendChild(prices)
  let vols = makeSvg(d.slice(-1), 'bars', 'vol', meta.box)
  meta.box.appendChild(vols)
  return meta
}

function makeSvg(vals, typ, priceVol, div){
  let typObj = {
      bars: makeBars,
      line: makeLine,
      OHLC: makeOHLC,
      hilo: makeHiLo
  }

  let ns = 'http://www.w3.org/2000/svg'
  let svg = document.createElementNS(ns, 'svg')
  svg.setAttribute('class', priceVol)
  div.appendChild(svg)
  let svgW = parseInt(window.getComputedStyle(svg).getPropertyValue('width'))
  let svgH = parseInt(window.getComputedStyle(svg).getPropertyValue('height'))
  svg.setAttribute('viewBox', `0 0 ${svgW} ${svgH}`)

  function makeLine(vals){
    vals = vals[0]
    let line = document.createElementNS(ns, 'polyline')
    let points = ''
    let pH = Math.max(...vals)
    let x = 0
    let xinc = svgW / (vals.length - 1) 

    vals.forEach((p,i) => {
      points += `${x},${svgH - (svgH / pH * p)} `
      x += xinc
    })
    line.setAttributeNS(null, 'stroke', 'lime')
    line.setAttributeNS(null, 'points', points.trim())
    svg.appendChild(line)
  }

  function makeOHLC(vals){}
  function makeHiLo(vals){
    let opts = {
      width: svgW / vals[0].length,
      height: 0,
      fill: null,
      //stroke: 'red',
      x: - svgW / vals[0].length,
      y: 0
    }
    
    let lH = Math.max(...vals[0])
    let pH = Math.max(...vals[1])
    vals[1].forEach((p,i,a)=> {
      let rect = document.createElementNS(ns, 'rect')
      opts.x += opts.width
      opts.height = (svgH / lH * p) - (svgH / lH *vals[0][i]) 
      opts.y = svgH - (svgH - (svgH - svgH/lH * p ))
      i > 0 && p >= a[i-1]
        ? opts.fill = 'green'
        : opts.fill = 'red'
      Object.keys(opts).forEach(k => {
        rect.setAttributeNS(null, k, opts[k])
      })
      svg.appendChild(rect)
    })
  }
  
  function makeBars(vals){
    vals = vals[0]
    let opts = {
      width: svgW / vals.length,
      height: 0,
      fill: 'red',
    //  stroke: 'green',
      x: - svgW / vals.length,
      y: 0
    }

    let pH = Math.max(...vals)
    vals.forEach((p,i,a) => {
      let rect = document.createElementNS(ns, 'rect')
      opts.x += opts.width
      opts.height = svgH / pH * p
      opts.y = svgH - opts.height
      i > 0 && p >= a[i-1]
        ? (//opts.stroke = 'green',
          opts.fill = 'green'
          )
        : (//opts.stroke = 'red',
          opts.fill = 'red'
          )
      Object.keys(opts).forEach(k => {
        rect.setAttributeNS(null, k, opts[k])
      })    
      svg.appendChild(rect)
    })
  } 
  typObj[typ](vals)
  return svg
}
