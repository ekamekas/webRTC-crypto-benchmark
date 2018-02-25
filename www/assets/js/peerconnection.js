/*
 * TODO:
 * > Complete peerconnection handler based on webRTC standard
 */

const rtcPeerConnection = new RTCPeerConnection();

var peerconnection = {
    createOffer : function(){
        rtcPeerConnection.createOffer().then((offer) => {
            return rtcPeerConnection.setLocalDescription(offer);
        });
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