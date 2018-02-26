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
                stream.onactive = MediaConnection.handler.onactive;
                stream.oninactive = MediaConnection.handler.oninactive;
                stream.onaddtrack = MediaConnection.handler.onaddtrack;
                stream.onremovetrack = MediaConnection.handler.onremovetrack;
                MediaConnection.stream = stream;
                if(videoDOM != undefined && videoDOM != null && videoDOM.nodeName.toLowerCase() == "video"){
                    videoDOM.srcObject = MediaConnection.stream;
                    videoDOM.play();
                }
            }).then(() => {
                return new Promise((resolve, reject) => {
                    resolve(MediaConnection.stream);
                });
            });
    },
    stream : null,
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
                videoDOM.srcObject = MediaConnection.stream;
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
            MediaConnection.stream.getTracks().forEach((track) => {
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
        }
    },
    audio : {
        default : {
            audio : true
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