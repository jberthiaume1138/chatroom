var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);  //wraps Express app in a Node.js HTTP server object - allows Socket.IO to run alongside
var io = socket_io(server);     //initialize Socket.IO Server, which is an EventEmitter

io.on('connection', function (socket) {     //listens for new clients to connect
    console.log('Client connected');

    socket.on('thing', function(message) {    //listens for a message called "thing"
        console.log('Received message:', message);
        socket.broadcast.emit('message', message);      //sends to all clients except the one whose socket we're using
    });
});

server.listen(8080);       // rather than app.listen, as app is wrapped by Server for Socket.IO
