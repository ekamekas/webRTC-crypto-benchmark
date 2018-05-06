import Constant from '../config/Constant.js';

var rtcPeerConnection = new RTCPeerConnection({
    'iceServer' : Constant.ICE_SERVER
});

var Peerconnection = {
    rtcPeerConnection : {
        configuration : {
            'iceServer' : Constant.ICE_SERVER,
            'certificates' : {
                name: 'RSASSA-PKCS1-v1_5',
                hash: 'SHA-256',
                modulusLength: 1024,
                publicExponent: new Uint8Array([1, 0, 1])
            }
        },
        setRtcPeerConnection : function(){
            return new Promise((resolve, reject) => {
                console.log("Generate certificate...");
                RTCPeerConnection.generateCertificate(
                    this.getCertificates()
                ).then(function(cert) {
                    console.log("Certificate :", cert)
                    rtcPeerConnection = new RTCPeerConnection({
                        'iceServer' : Constant.ICE_SERVER,
                        'certificates' : [cert]
                    });
                    Peerconnection.onaddtrack = function(handler){
                        rtcPeerConnection.onaddstream = handler;
                    }
                    Peerconnection.onremovetrack = function(handler){
                        rtcPeerConnection.onremovestream = handler;
                    }
                    console.log("RTCPeerConnection :", rtcPeerConnection);
                    resolve(rtcPeerConnection);
                })
            });
        },
        getRtcPeerConnection : function(){
            return rtcPeerConnection;
        },
        closeRtcPeerConnection : function(){
            rtcPeerConnection.close();
        },
        setIceServer : function(iceConfiguration){
            this.configuration.iceServer = iceConfiguration;
        },
        getIceServer : function(){
            return this.configuration.iceServer;
        },
        setCertificates : function(certConfiguration){
            return new Promise((resolve, reject) => {
                this.configuration.certificates = certConfiguration;
                resolve();
            })
        },
        getCertificates : function(){
            return this.configuration.certificates || {};
        }
    },
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
    localDescription : {
        get : function(){
            return rtcPeerConnection.localDescription;
        },
        set : function(description){
            return rtcPeerConnection.setLocalDescription(description);
        }
    },
    remoteDescription : {
        get : function(){
            return rtcPeerConnection.remoteDescription;
        },
        set : function(description){
            return rtcPeerConnection.setRemoteDescription(description);
        }
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

export {Peerconnection};