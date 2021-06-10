const http = require('http')
const fs = require('fs')

let readStream = fs.createReadStream('./colorBlocks.png')
var stat = fs.statSync('./colorBlocks.png');


const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'image/png',
    'Content-Length': stat.size
  }
}

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error)
})

readStream.on('finish', () => {
    req.end()
})

readStream.pipe(req)

//req.end()
