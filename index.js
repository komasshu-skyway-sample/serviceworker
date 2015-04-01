var express = require('express')
  , app = express()
  , server = require('http').Server(app)
  , io = require('socket.io')(server)

var port = process.env.VCAP_APP_PORT || process.env.PORT || 3000;

app.use(express.static("./public"));

io.on('connection', function(s){
  s.on('mesg', function(data){
    s.emit('mesg', data);
  })
});

server.listen(port)

console.log("app is litening on port %d", port)
