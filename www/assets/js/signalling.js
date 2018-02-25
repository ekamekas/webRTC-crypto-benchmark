/*
 *  TODO:
 *  > [Add] Handle room message
 */

const SERVER = "localhost:8081";
const ROOM_NUMBER = window.location.pathname.split("/").pop();
const SOCKET = io(SERVER);

var signalling = {
    sendMessage : function(name, message){
        if(SOCKET == null || SOCKET == undefined){
            alert("Socket not found");
            return;
        }
        SOCKET.emit(name, message);
    },
    sendRoom : function(message, roomNumber){
        let room = roomNumber || ROOM_NUMBER;
        if(SOCKET == null || SOCKET == undefined){
            alert("Socket not found");
            return;
        }
        let data = {
            room : room,
            data : message
        };
        signalling.sendMessage("room", data);
    },
    onMessage : function(name, handler){
        if(SOCKET == null || SOCKET == undefined){
            alert("Socket not found");
            return;
        }
        SOCKET.on(name, (message) => {
            handler(message);
            return;
        });
    },
    joinRoom : function(number){
        let room = number || ROOM_NUMBER;
        if(SOCKET == null || SOCKET == undefined){
            alert("Socket not found");
            return;
        }
        signalling.sendMessage("join", room);
    }
};