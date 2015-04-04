function consume(reader) {
  var chunks = [];
  function rec() {
    return reader.read().then(function(r) {
      if (r.done) { return chunks; }
      else {
        _arrayBufferToString(r.value, function(str){
          // todo mesgを河合さんのに送る
          var mesg = str.split(" ")[0];
          console.log(mesg);
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
  // We have the body string here!
  console.log(chunks);
});
