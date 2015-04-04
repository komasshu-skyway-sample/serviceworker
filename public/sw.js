/* service worker */
console.log('sw!!');

var a = navigator.geolocation ? "requestMIDIAccess": "none";
console.log(a)

addEventListener("message", function(ev){
  console.log(ev);
}, false)


self.addEventListener('push', function(event) {  
  console.log('Received a push message', event);

  var title = 'Yay a message.';  
  var body = 'We have received a push message.';  
  var icon = '/images/icon-192x192.png';  
  var tag = 'simple-push-demo-notification-tag';

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



/*
navigator.requestMIDIAccess().then(function(m){
  console.log("success to access MIDI: ", m);
}, function(err){
  console.log("failed to acccess MIDI: ", err);
}).catch(function(err){
  console.log("requestMIDIAcccess Errro: ", err);
});

*/
