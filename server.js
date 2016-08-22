var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var userList = {};

io.on('connection', function (socket) {

    socket.on('store nickname', function(nickname) {
        userList[socket.id] = nickname;
        io.emit('user joined', nickname, userList);
    });

    socket.on('disconnect', function() {
        var departed = userList[socket.id];
        delete userList[socket.id];
        io.emit('user disconnected', departed, userList);
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
