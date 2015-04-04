var express = require('express')
  , app = express()
  , server = require('http').Server(app)
  , io = require('socket.io')(server)
  , twitter = require('ntwitter')
  , EventEmitter = require('events').EventEmitter
  , fs = require('fs')

var conf = JSON.parse(fs.readFileSync(__dirname + "/conf/twitter.conf"));

console.log(conf);

var tw = new twitter({
  consumer_key: conf.consumer_key,
  consumer_secret: conf.consumer_secret,
  access_token_key: conf.access_token_key,
  access_token_secret: conf.access_token_secret
});
var port = process.env.VCAP_APP_PORT || process.env.PORT || 3000;

function asyncFunc() {
  var ev = new EventEmitter;
  console.log('in asyncFunc');

  tw.stream('statuses/filter', {'track':'#さーびすわーかー'}, function(stream) {
    stream.on('data', function (data) {
      console.log(data.text);
      ev.emit('send', data.text);
    });
  });
  return ev;
}

var async = asyncFunc();


app.use(express.static("./public"));

io.on('connection', function(s){
  s.on('mesg', function(data){
    s.emit('mesg', data);
  })
});


app.get('/stream', function(req, res){

  res.setHeader("Content-Type", "application/octet-stream; charset=UTF-8");
  res.setHeader("Transfer-Encoding", "chunked");

  var cb = function(arg){
    console.log(arg);
    res.write(arg)
  }

  async.on('send', cb);
  
  req.on('close', function(ev){
    async.removeListener('send', cb);
  })
})

server.listen(port)

console.log("app is litening on port %d", port)
