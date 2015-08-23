var express = require('express')
  , app = express()
  , server = require('http').Server(app)
  , io = require('socket.io')(server)
  , twitter = require('ntwitter')
  , EventEmitter = require('events').EventEmitter
  , logger = require('log4js').getLogger()
  , conf = require("./conf/twitter.json")

console.log(conf);

var tw = new twitter({
  consumer_key: conf.consumer_key,
  consumer_secret: conf.consumer_secret,
  access_token_key: conf.access_token_key,
  access_token_secret: conf.access_token_secret
});
var port = process.env.VCAP_APP_PORT || process.env.PORT || 3000;

var track_word = "#nowplaying";

function asyncFunc() {
  var ev = new EventEmitter;
  console.log('in asyncFunc');

  tw.stream('statuses/filter', {'track':track_word}, function(stream) {
    stream.on('data', function (data) {
      logger.info(data.text);
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
  var cnt = 0;

  res.setHeader("Content-Type", "application/octet-stream; charset=UTF-8");
  res.setHeader("Transfer-Encoding", "chunked");

  async.on('send', function(data) {
      res.write(data)

      if(cnt++ > 1000) res.end("");
  });

  req.on('close', function(ev){
    cnt = 0;
    async.removeListener('send', cb);
  })
})

server.listen(port)

console.log("app is litening on port %d", port)
