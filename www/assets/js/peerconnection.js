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

var peerconnection = {
    createOffer : function(stream){
        if(stream == null || stream == undefined)
            return;
        stream.getTracks().forEach((track) => {
            rtcPeerConnection.addTrack(track, stream);
        });
        return rtcPeerConnection.createOffer();
    },
    createAnswer : function(){
        rtcPeerConnection.createAnswer().then((answer) => {
            return rtcPeerConnection.setLocalDescription(answer);
        });
    },
    // Event handler
    onoffer : function(offer){
    },
    onanswer : function(answer){
    }
};