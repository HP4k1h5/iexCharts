const metaArr = []
class Meta {
  constructor(sec, time, type){
    this.id = null
    this.sec = sec || 'msft'
    this.time = time || '1d'
    this.type = type || 'bars'
    this.url = null
    this.box = null
    this.high = null
    this.low = null
  }

  setId(){
    this.id = metaArr.length === 0 
      ? 0
      : Math.max(...Object.keys(metaArr).map(k => metaArr[k]['id'])) + 1
    metaArr.push(this)
    return this
  }

  makeUrl(q){
    let base = 'https://api.iextrading.com/1.0/stock/'
    if (q){
      this.url = encodeURI(`${base}${this.sec}/quote`)
    }
    else{
      this.url = encodeURI(`${base}${this.sec}/chart/${this.time}`) 
    }
    return this
  }

  deleteMe(meta){
    meta.box.parentNode.removeChild(meta.box)
    metaArr.splice(meta.id, 1)
  }
}
