var express = require("express");
var app = express();
var fs = require("fs");
var server = require("https");
var httpsServer = server.createServer({
    key:fs.readFileSync("config/ssl/webrtc.laman.local.key"),
    cert:fs.readFileSync("config/ssl/webrtc.laman.local.crt")
}, app);
var io = require("socket.io")(httpsServer, {secure: true});
const path = require("path");

const config = JSON.parse(fs.readFileSync("config.json"));
const port = config.port || process.env.port || 8081 ;

var socketMap = new Map();  // List user beserta objek socket

httpsServer.listen(port, () => {
    console.log("Listening at " + port);
});

app.use("/assets", express.static(config.www.assets.root));

app.route("/")
    .get((req, res) => {
        res.sendFile(path.join(__dirname, config.www.desktop.index));
    });

app.route("/room/master/:roomId")
    .get((req, res) => {
        // Send room client html file
        res.sendFile(path.join(__dirname, config.www.desktop.appMaster));
    });

app.route("/room/slave/:roomId")
    .get((req, res) => {
        // Send room client html file
        res.sendFile(path.join(__dirname, config.www.desktop.appSlave));
    });

io.on("connection", (socket) => {
    console.log("Somebody in!");
    socket.on("add-user", (data, ack) => {
        if(socketMap.has(data.id)){
            ack(false);
        } else {
            socketMap.set(data.id, socket.socket);
            socket.join(data.id);
            ack(true);
        }
    });

    socket.on("join", (room) => {
        if(isRoomExceedCap(room, socket))
            return;
        socket.join(room);
    });

    socket.on("room", (req) => {
        let room = req.room;
        let type = req.data.type;
        let message = req.data.message;
        console.dir(req);
        socket.to(room).emit(type, message);
    });

    socket.on("disconnect", () => {
        console.log("Somebody out!");
    });

});

function isRoomExist(room, socket){
    let rooms = Object.keys(io.sockets.adapter.rooms);
    return rooms.indexOf(room) >= 0;
}

function isRoomExceedCap(room, socket){
    if(!isRoomExist(room))
        return false;
    let clientTotal = io.sockets.adapter.rooms[room].length;
    return clientTotal > 1;
}