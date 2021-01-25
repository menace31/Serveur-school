let http = require('http') // import module et le stock dans la variable http
let fs = require('fs')
let url = require('url')
const EventEmitter = require('events')


let server = http.createServer()

server.on('request', function(request, response) {
    fs.readFile('index.html', (err,data) => {
        if (err) {
            response.writeHead(404)
            response.end("Ce fichier n'existe pas sorry")
        }

        response.writeHead(200,{'Content-type': 'text/html; charset=utf-16'}) // permet de
        response.end(data)
    })
})

server.listen(8080)











