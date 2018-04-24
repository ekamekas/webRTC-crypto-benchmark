/*
    TODO:
    > Applying constraint to MediaDevice object
*/


var MediaConnection = {
    start : function(videoDOM, constraint){
        if(constraint == undefined || constraint == null)
            constraint = Constraint.constraintsBuilder(Constraint.video.standard, Constraint.audio.default, Constraint.facemode.env);
        return navigator.mediaDevices.getUserMedia(constraint)
            .then((stream) => {
                stream.onactive = this.handler.onactive;
                stream.oninactive = this.handler.oninactive;
                stream.onaddtrack = this.handler.onaddtrack;
                stream.onremovetrack = this.handler.onremovetrack;
                this.stream = stream;
                if(videoDOM != undefined && videoDOM != null && videoDOM.nodeName.toLowerCase() == "video"){
                    videoDOM.srcObject = this.stream;
                    videoDOM.play();
                }
            }).then(() => {
                return new Promise((resolve, reject) => {
                    resolve(this.stream);
                });
            });
    },
    stream : null,
    onaddtrack : function(videoDOM, stream){
        stream.onactive = this.handler.onactive;
        stream.oninactive = this.handler.oninactive;
        stream.onaddtrack = this.handler.onaddtrack;
        stream.onremovetrack = this.handler.onremovetrack;
        this.stream = stream;
        if(videoDOM != undefined && videoDOM != null && videoDOM.nodeName.toLowerCase() == "video"){
            videoDOM.srcObject = this.stream;
            videoDOM.play();
        }
    },
    handler : {
        onactive : function(){

        },
        onaddtrack : function(){
            
        },
        oninactive : function(){

        },
        onremovetrack : function(){

        }
    },
    control : {
        // FIXME: Video source ga ada handlernya ketika selelah melakukan aksi stop() -> start()
        play : function(videoDOM){
            if(videoDOM.nodeName.toLowerCase() != "video")
                return "Not video DOM";
            if(videoDOM.srcObject == null)
                videoDOM.srcObject = this.stream;
            videoDOM.play();
        },
        pause : function(videoDOM){
            if(videoDOM.nodeName.toLowerCase() != "video")
                return "Not video DOM";
            videoDOM.pause();
        },
        stop : function(videoDOM){
            if(videoDOM.nodeName.toLowerCase() != "video")
                return "Not video DOM";
            this.stream.getTracks().forEach((track) => {
                track.stop();
            });
            videoDOM.srcObject = null;
        }
    }
};

const Constraint = {
    video : {
        standard : {
            video : {
                width : 480,
                height : 320,
                aspectRation : 1.777777778
            }
        },
        highQuality : {
            video : {
                width : 858,
                height : 480,
                aspectRation : 1.777777778
            }
        },
        highDefinition : {
            video : {
                width : 1280,
                height : 720,
                aspectRation : 1.777777778
            }
        },
        disable : {
            video : false
        }
    },
    audio : {
        default : {
            audio : true
        },
        disable : {
            audio : false
        }
    },
    facemode : {
        selfie : {
            facingMode : {
                exact : "user"
            }
        },
        env : {
            facingMode : {
                exact : "environment"
            }
        },
        auto : {
            facingMode : "environment"
        }
    },
    constraintsBuilder : function(){
        let result = {};
        let args = Array.from(arguments);
        args.forEach(arg => {
            Object.assign(result, arg);
        });
        return result;
    }
};

export default {MediaConnection} = MediaConnection;