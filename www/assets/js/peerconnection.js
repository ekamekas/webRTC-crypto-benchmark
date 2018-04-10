/*
 * TODO: Next
 * > Peer-ing with webRTC
 */

const rtcPeerConnection = new RTCPeerConnection({
    'iceServers' : [
        {
            'urls':'stun:stun.example.org'
        }
    ]
});

var Peerconnection = {
    createOffer : function(stream){
        if(stream == null || stream == undefined)
            return;
        stream.getTracks().forEach((track) => {
            rtcPeerConnection.addTrack(track, stream);
        });
        return rtcPeerConnection.createOffer();
    },
    createAnswer : function(stream){
        this.addStream(stream);
        return rtcPeerConnection.createAnswer();
    },
    addStream : function(stream){
        stream.getTracks().forEach((track) => {
            rtcPeerConnection.addTrack(track, stream);
        });
    },
    // Event handler
    onoffer : function(offer){
    },
    onanswer : function(answer){
    },
    onaddtrack : function(handler){
        rtcPeerConnection.onaddstream = handler;
    },
    onremovetrack : function(handler){
        rtcPeerConnection.onremovestream = handler;
    }
};

export {Peerconnection,rtcPeerConnection};