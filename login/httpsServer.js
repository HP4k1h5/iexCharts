const https = require('https')
const fs = require('fs')
const path = require('path')
const qs = require('querystring')
const mysql = require('mysql')

const { 
  nodeHost,
  nodePort,
  nodeOptions,
  mysqlHost,
  mysqlUser,
  mysqlPassword 
} = require('./settings.js')

const extensions = { 
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.jpg': 'image/jpg',
  '.ico': 'image/ico'
}

let cnx = mysql.createConnection({
  host: mysqlHost,
  user: mysqlUser,
  password: mysqlPassword,
  database: 'iex_db'
})

function reqHandler(req, res){
  if (req.method === 'GET'){
    reqGet(req, res)
  }
  else if (req.method === 'POST'){
    reqPost(req, res)
  }
}

function reqGet(req, res){
  let fileName = path.basename(req.url) === ''
    ? 'index.html'
    : path.basename(req.url)
  let ext = path.extname(fileName)
  if (! extensions[ext]){
    res.writeHead(404, {'Content-Type': 'text/html'})
    res.end(`bad request for ${fileName}`)
  }
  let localFolder = __dirname + '/public/'
  staticFileRead((localFolder + fileName), ext,  res)
} 

let { loginUser, createUser } = require('./iex_mysql')
function reqPost(req, res){
  let postData = ''
  req.on('data', data => {
    data.length < 1e7
      ? postData += data
      : (res.writeHead(413),
        res.end('too large'),
        req.connection.destroy())
  })

  req.on('end', () => {
    let {alias, email, password} = qs.parse(postData)
    alias 
      ? createUser(alias, email, password, cnx)
      : loginUser(email, password, cnx, res)
  }) 
}

function staticFileRead(req, ext, res){
  fs.exists(req, function(exists){
    if (exists){
      fs.readFile(req, 'utf8', (err, data) => {
        if (err){
          console.error(`read err: ${err}`)
          res.writeHead(404)
          res.end(`read err: ${err}`)
        }
        else{
          res.writeHead(200, {
            'Content-Type': ext,
            'Content-length': data.length
          })
          res.end(data)
        }
      })
    }
    else{
      console.error(`no such file: ${req}`)
      res.writeHead(404)
      res.end(`no such file: ${req}`)
    }
  })
}

https.createServer(nodeOptions, reqHandler).listen(nodePort)
console.log( `https server online @https://${nodeHost}:${nodePort}...`)
