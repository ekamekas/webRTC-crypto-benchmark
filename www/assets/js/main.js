import Signalling from './signalling.js';
import MediaConnection from './mediaconnection.js';
import {Peerconnection,rtcPeerConnection} from './peerconnection.js';

// Setup variables

var localVideo = document.getElementById("local-media-container").querySelector("video");
var remoteVideo = document.getElementById("remote-media-container").querySelector("video");

var localMediaControl = {
    call : document.getElementById("local-control-call"),
    play : document.getElementById("local-control-play"),
    pause : document.getElementById("local-control-pause"),
    stop : document.getElementById("local-control-stop")
};
var remoteMediaControl = {
    play : document.getElementById("remote-control-play"),
    pause : document.getElementById("remote-control-pause"),
    stop : document.getElementById("remote-control-stop")
};
var localMediaQualityList = document.getElementById("quality-control-local").querySelectorAll("input");
var remoteMediaQualityList = document.getElementById("quality-control-remote").querySelectorAll("input");
var localMediaTypeList = document.getElementById("type-control-local").querySelectorAll("input");
var remoteMediaTypeList = document.getElementById("type-control-remote").querySelectorAll("input");

var signallingMessage = {
    type : "",
    message : {}
}

// End setup variables

// Start define event listeners

// Media control listener
Object.keys(localMediaControl).forEach((key) => {
    localMediaControl[key].addEventListener("click", (e) => {
        onlocalcontrolchange(localMediaControl[key].value);
    });
});
Object.keys(remoteMediaControl).forEach((key) => {
    remoteMediaControl[key].addEventListener("click", (e) => {
        onremotecontrolchange(remoteMediaControl[key].value);
    });
});

// Media quality listener
localMediaQualityList.forEach((quality) => {
    quality.addEventListener("click", (e) => {
        onlocalqualitychange(quality.value);
    })
});
remoteMediaQualityList.forEach((quality) => {
    quality.addEventListener("click", (e) => {
        // Quality radio button click handler
    })
});

// Media type listener
localMediaTypeList.forEach((type) => {
    type.addEventListener("click", (e) => {
        // Type radio button click handler
    })
});
remoteMediaTypeList.forEach((type) => {
    type.addEventListener("click", (e) => {
        // Type radio button click handler
    })
});

// End define event listeners

// Start define event handler

var onlocalcontrolchange = function(control){
    switch(control){
        case "call" :
            mediaPeer();
            break;
        case "play" :
            MediaConnection.control.play(localVideo);
            localMediaControl.play.disabled = true;
            localMediaControl.pause.disabled = false;
            localMediaControl.stop.disabled = false;
            break;
        case "pause" :
            MediaConnection.control.pause(localVideo);
            localMediaControl.play.disabled = false;
            localMediaControl.pause.disabled = true;
            localMediaControl.stop.disabled = false;
            break;
        case "stop" :
            MediaConnection.control.stop(localVideo);
            localMediaControl.play.disabled = false;
            localMediaControl.pause.disabled = true;
            localMediaControl.stop.disabled = true;
            break
        default :
            console.log("Error")
            break;
    };
};

var onremotecontrolchange = function(control){
    switch(control){
        case "play" :
            break;
        case "pause" :
            break;
        case "stop" :
            break
        default :
            console.log("Error")
            break;
    };
};

var onlocalqualitychange = function(quality){
    switch(quality){
        case "sd" :
            mediaPeer(Constraint.constraintsBuilder(Constraint.video.standard, Constraint.audio.default, Constraint.facemode.env));
            break;
        case "hq" :
            mediaPeer(Constraint.constraintsBuilder(Constraint.video.highQuality, Constraint.audio.default, Constraint.facemode.env));
            break;
        case "hd" :
            mediaPeer(Constraint.constraintsBuilder(Constraint.video.highDefinition, Constraint.audio.default, Constraint.facemode.env));
            break;
        default :
            console.log("Error");
            break;
    }
};

// End define event handler

// Start service
// Override media handler
MediaConnection.handler.onactive = function(){

};
MediaConnection.handler.onaddtrack = function(){
    
};
MediaConnection.handler.oninactive = function(){
    
};
MediaConnection.handler.onremotetrack = function(){
    
};

// Signalling
Signalling.joinRoom();

// Register peerconnection event handler
Peerconnection.onoffer = function(offer){
    console.log("On Offer\n", offer);
    Peerconnection.remoteDescription.set(offer).then(() => {
        console.log("Remote description", Peerconnection.remoteDescription.get());
        console.log("Get user media");
        return MediaConnection.start(localVideo);
    })
    .then((stream) => {
        console.log("Create answer");
        return Peerconnection.createAnswer(stream);
    })
    .then((answer) => {
        console.log("Answer\n", offer);
        return Peerconnection.localDescription.set(answer);
    })
    .then(() => {
        console.log("Local description\n", Peerconnection.localDescription.get());
        signallingMessage.type = "answer";
        signallingMessage.message = Peerconnection.localDescription.get();
        Signalling.sendRoom(signallingMessage);
        console.log("Blast message\n", signallingMessage);
    });
};

Peerconnection.onanswer = function(answer){
    console.log("On Answer\n", answer);
    Peerconnection.remoteDescription.set(answer);
    console.log("Remote description\n", Peerconnection.remoteDescription.get());
};

// Register signal plane handler
Signalling.onMessage("room", (message) => {
    console.log(message);
});
Signalling.onMessage("offer", (data) => {
    Peerconnection.onoffer(data);
});
Signalling.onMessage("answer", (data) => {
    Peerconnection.onanswer(data);
});

// Register peerconnection handler
Peerconnection.onaddtrack(function(e){
    console.log("On add track");
    MediaConnection.onaddtrack(remoteVideo,e.stream)
});

// End logic

// Additional function
function mediaPeer(constraint){
    MediaConnection.start(localVideo, constraint).then(stream => {
        console.log("Get user media");
        Peerconnection.createOffer(stream).then((offer) => {
            console.log("Create offer");
            console.log("Offer\n", offer);
            return Peerconnection.localDescription.set(offer);
        }).then(() => {
            console.log("Local description\n", Peerconnection.localDescription.get());
            signallingMessage.type = "offer";
            signallingMessage.message = Peerconnection.localDescription.get();
            Signalling.sendRoom(signallingMessage);
            console.log("Blast message", signallingMessage);
        });
    });
}

// End additional function