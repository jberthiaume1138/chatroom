var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);  //wraps Express app in a Node.js HTTP server object - allows Socket.IO to run alongside
var io = socket_io(server);     //initialize Socket.IO Server, which is an EventEmitter

var connections = 0;    // counter for number of connected clients

var users = [];

io.on('connection', function (socket) {

    // io.emit('user connected', connections);     //sends to everyone

    // console.log('A user connected. Hello ' + socket.id);
    // console.log('There are currently ' + connections + ' users online.');

    socket.on('store nickname', function(nickname) {
        connections++;
        users[socket.id] = nickname;
        console.log(users);
        io.emit('user joined', connections, nickname);
    });

    socket.on('disconnect', function() {
        connections--;
        var departed = users[socket.id];
        console.log(departed + ' ' + socket.id + ' has left the room.');
        io.emit('user disconnected', connections, departed);      //sends to everyone


        // console.log('A user has gone offline.');
        // console.log('There are currently ' + connections + ' users online.');
    });

    socket.on('chat', function(message) {
        // console.log('Received message from:' + users[socket.id], message.nickname,  message.text);
        socket.broadcast.emit('message', message);      //sends to all clients except the one whose socket we're using
    });

    socket.on('typing', function() {
        socket.broadcast.emit('typing', users[socket.id]);
    });

    socket.on('stop typing', function() {
        socket.broadcast.emit('stop typing', users[socket.id]);
    });
});

server.listen(8080);       // rather than app.listen, as app is wrapped by server for Socket.IO
