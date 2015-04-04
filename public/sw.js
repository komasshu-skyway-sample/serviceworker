/* service worker */
console.log('sw!!');

var a = navigator.geolocation ? "requestMIDIAccess": "none";
console.log(a)

addEventListener("message", function(ev){
  console.log(ev);
}, false)




/*
navigator.requestMIDIAccess().then(function(m){
  console.log("success to access MIDI: ", m);
}, function(err){
  console.log("failed to acccess MIDI: ", err);
}).catch(function(err){
  console.log("requestMIDIAcccess Errro: ", err);
});

*/
