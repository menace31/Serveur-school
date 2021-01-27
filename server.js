let http = require('http'); // import module et le stock dans la variable http

let fs = require('fs')

let server = http.createServer()

server.on('request',(request,response) => {
    fs.readFile('index.html',(err,data) => {
        if (err) throw err


        response.end(data)
    })

});

server.listen(8080);





















