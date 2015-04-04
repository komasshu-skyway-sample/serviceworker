/* service worker */
console.log('sw!!');

var a = navigator.geolocation ? "requestMIDIAccess": "none";
console.log(a)

addEventListener("message", function(ev){
  console.log(ev);
}, false)


self.addEventListener('push', function(event) {  
  console.log('Received a push message', event);

  var title = 'メッセージを受け取ったよ';  
  var body = 'We have received a push message.';  
  var icon = '/miku.jpg';  
  var tag = 'simple-push-demo-notification-tag';

  clients.matchAll().then(function(clients){
    console.log(clients);
    clients[0].postMessage("aaa");
    if(clients[1]) clients[1].postMessage("aaa");
  });

  event.waitUntil(  
    self.registration.showNotification(title, {  
      body: body,  
      icon: icon,  
      tag: tag  
    })
  );  
});


self.addEventListener('notificationclick', function(e){
  e.notification.close();

  e.waitUntil(clients.openWindow('/'));

});


self.addEventListener('message', function(e){
  console.log(e);
});


/*
navigator.requestMIDIAccess().then(function(m){
  console.log("success to access MIDI: ", m);
}, function(err){
  console.log("failed to acccess MIDI: ", err);
}).catch(function(err){
  console.log("requestMIDIAcccess Errro: ", err);
});

*/
