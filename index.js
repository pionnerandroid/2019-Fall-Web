const http = require('http')

http.createServer((req, res) => {
    res.write('<h1> Hello, World!</h1>')
    res.end('<p> Hello, Node.js</p>')
}).listen(8080, ()=> {
    console.log("Server Stated on 3000")
})