window.addEventListener('polymer-ready', function(event) {
    console.log("polymer ready");

    document.getElementById("sendpokemikutext").addEventListener('mousedown', function(event){
        var text=document.getElementById("pokemikutext").value;
        mapp.playMiku(text);
    });

    // add iframe for postmessge(?)
    var iframe=document.createElement("iframe");
    iframe.src="testWindow.html";
    iframe.setAttribute("width", "400px");
    iframe.style.setProperty("border", "1px #ddd solid");
    iframe.style.setProperty("border-radius", "3px");
    iframe.style.setProperty("margin-top", "5px");
    document.body.appendChild(iframe);
    
});


// webmidi_app Object
var webmidi_app=function(miku, arduino){
    this.miku_device=miku;
    this.arduino_device=arduino;
};
webmidi_app.prototype={
    playMiku: function(text) {
        var miku_device=document.getElementById(this.miku_device);
        if(miku_device.checkOutputIdx()=="false") {
            console.log("[ERROR] Select Poke-Miku Output Device");
            return;
        }
        var sysEx=nsx39.getUpdateSysExByText(text.replace(/。/g, "").replace(/ /g, ""), 0, false);
        miku_device.sendRawMessage(sysEx.sysEx, 0);
        var time=0, interval=500;
        for(var i=0; i<text.length; i++) {
            miku_device.sendRawMessage([0x90, 0x45, 0x45], time);
            miku_device.sendRawMessage([0x80, 0x45, 0x45], time+interval);
            time+=interval;
        }
        console.log("[Send Text] ", sysEx, text);
    },
    lChika: function(blinkNum) {
        console.log(blinkNum);
        if(typeof blinkNum=="undefined") blinkNum=12;
        blinkNum=blinkNum+blinkNum%2;
        var arduino_device=document.getElementById(this.arduino_device);
        if(arduino_device.checkOutputIdx()=="false") {
            console.log("[ERROR] Select Arduino Output Device");
            return;
        }
        var time=0, interval=250;
        for(var i=0; i<blinkNum*2; i++) {
            time+=interval;
            if(i%2==0) arduino_device.sendRawMessage([0x90, 0x45, 0x45], time);
            if(i%2==1) arduino_device.sendRawMessage([0x80, 0x45, 0x45], time+interval/2);
        }
    },
    hello: function() {
        console.log("hello!!");
    }
};
var mapp=new webmidi_app("pokemiku", "arduino");
