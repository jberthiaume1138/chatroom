var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var connections = 0;    // counter for number of connected clients

var userList = {};

io.on('connection', function (socket) {

    // var clients = io.sockets.sockets;
    // for(var client in clients) {
    //     console.log(client);
    // }

    socket.on('store nickname', function(nickname) {
        connections++;
        userList[socket.id] = nickname;
        console.log(userList);

        io.emit('user joined', connections, nickname, userList);
    });

    socket.on('disconnect', function() {
        connections--;
        var departed = userList[socket.id];
        console.log(departed);
        delete userList[socket.id];
        io.emit('user disconnected', connections, departed, userList);
        console.log('Someone left ' + socket.id);
    });

    socket.on('chat', function(message) {
        socket.broadcast.emit('message', message);
    });

    socket.on('typing', function() {
        var nickname = userList[socket.id];
        socket.broadcast.emit('typing', nickname);
    });


    socket.on('stop typing', function() {
        var nickname = userList[socket.id];
        socket.broadcast.emit('stop typing', nickname);
    });
});

server.listen(8080);       // rather than app.listen, as app is wrapped by server for Socket.IO
