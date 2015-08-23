function consume(reader) {
  var chunks = [];
  var cnt = 0;
  function rec() {
    return reader.read().then(function(r) {
      if (r.done) { return "finished!!"; }
      else {
        _arrayBufferToString(r.value, function(str){
          var mesg = str;
          //   mapp.playMiku(mesg);
          //   mapp.lChika(mesg.length);
          cnt++;
          $("#messages").html("message no." + cnt + ": " + mesg);

        })
        return rec();
      }
    });
  }
  return rec();
}

function _arrayBufferToString(ui8a, callback) {
  var bb = new Blob([ui8a]);
  var f = new FileReader();
  f.onload = function(e) {
    callback(e.target.result);
  };
  f.readAsText(bb);
}


fetch("/stream").then(function(res) {
  console.log("fetch consumed")
  return consume(res.body.getReader());
}).then(function(chunks) {
  console.log(chunks);
});
