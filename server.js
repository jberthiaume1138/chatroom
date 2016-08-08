var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);  //wraps Express app in a Node.js HTTP server object - allows Socket.IO to run alongside
var io = socket_io(server);     //initialize Socket.IO Server, which is an EventEmitter

var connections = 0;    // counter for number of connected clients

io.on('connection', function (socket) {     //listens for new clients to connect
    connections++;
    io.emit('user connected', connections);     //sends to everyone

    console.log('A user connected.');
    console.log('There are currently ' + connections + ' users online.');

    socket.on('disconnect', function() {    //listens for disconnects
        connections--;
        io.emit('user disconnected', connections);      //sends to everyone

        console.log('A user has gone offline.');
        console.log('There are currently ' + connections + ' users online.');
    });

    socket.on('chat', function(message) {    //listens for a message called "chat"
        console.log('Received message:', message);
        socket.broadcast.emit('message', message);      //sends to all clients except the one whose socket we're using
    });

    socket.on('typing', function(){
        io.emit('typing');
    })
});


server.listen(8080);       // rather than app.listen, as app is wrapped by server for Socket.IO
