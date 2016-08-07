$(document).ready(function() {                  // this is all client side
    var socket = io();  // Manager object
    var input = $('input');
    var messages = $('#messages');

    var addMessage = function(message) {
        messages.append('<div>' + message + '</div>');
    };

    input.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }
        var message = input.val();
        addMessage(message);
        socket.emit('chat', message);    // sends to the Socket.IO server
        input.val('');
    });

    socket.on('message', addMessage);

    var updateUserCount = function (connections) {
        $('#users').empty();
        $('#users').append('<p>' + connections + ' users currently online.</p>');
    };

    socket.on('connection', updateUserCount);

    socket.on('disconnect', updateUserCount);

});
