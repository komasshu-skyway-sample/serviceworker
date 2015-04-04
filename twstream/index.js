var twitter = require('ntwitter');
var http = require('http');

var EventEmitter = require('events').EventEmitter;

function asyncFunc() {
  var ev = new EventEmitter;
  console.log('in asyncFunc');
  setInterval(function () {
    ev.emit('send', 'foo', 'bar');
  }, 1000);
  return ev;
}

var async = asyncFunc();

var tw = new twitter({
  consumer_key: 'xx',
  consumer_secret: 'xx',
  access_token_key: 'xx',
  access_token_secret: 'xx'
});

var port = process.env.VCAP_APP_PORT || process.env.PORT || 3001;

var server = http.Server();

// tw.stream('statuses/filter', {'track':'#serviceworker'}, function(stream) {
//   stream.on('data', function (data) {
//     console.log(data);
//   });
// });
//

server.on('request', function(req, res){

  var cb = function(arg){
    console.log(arg);
    res.write(arg)
  }

  async.on('send', cb);
  setTimeout(function(ev){
    async.removeListener('send', cb);
    res.end();
  }, 3000)
})

server.listen(port);
