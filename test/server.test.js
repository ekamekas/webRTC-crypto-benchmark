var fs = require("fs");
var mas = require("socket.io-client");
var eka = require("socket.io-client");
var setiawan = require("socket.io-client");
var jest = require("jest");

var config = JSON.parse(fs.readFileSync("config.json"));

var socketMas = mas.connect("http://localhost:" + config.port);
var socketEka = eka.connect("http://localhost:" + config.port);
var socketSetiawan = setiawan.connect("http://localhost:" + config.port);

test("addUser-good", () => {
    socketMas.emit("add-user", {
        "id":"mas"
    }, (ack) => {
        expect(ack).toBe(true);
    });
    socketEka.emit("add-user", {
        "id":"Eka"
    }, (ack) => {
        expect(ack).toBe(true);
    });
});

test("addUser-bad", () => {
    var ack;
    socketSetiawan.emit("add-user", {
        "id":"mas"
    }, (res) => {
        ack = res;
        console.log(ack);
    });
    expect(ack).toBe(false);
    // socketSetiawan.emit("add-user", {
    //     "id":"mas"
    // }, (ack) => {
    //     expect(ack).toBe(true);
    // });
});
