$(document).ready(function() {                  // this is all client side
    var socket = io();  // Manager object
    var input = $('input');
    var messages = $('#messages');

    var addMessage = function(message) {
        messages.append('<p><span class="userheader">' + socket.id + ' says: </span>' + message + '</p>');
    };

    input.on('keydown', function(event) {
        if (event.keyCode != 13) {
            setTimeout(function() {
                socket.emit('typing');
            }, 3000);
        }
        else {      // enter key - submit a message up to the server
            var message = input.val();
            addMessage(message);
            socket.emit('chat', message);    // sends to the Socket.IO server
            input.val('');
        }
    });

    socket.on('message', addMessage);

    var updateUserCount = function (connections) {
        console.log('user state change');
        $('#users').empty();
        $('#users').append('<p>' + connections + ' users currently online.</p>');
    };

    var showUserTyping = function() {
        $('#notify').empty();
        $('#notify').append('User ID: ' + socket.id + ' is typing');
    };

    socket.on('user connected', updateUserCount);
    socket.on('user disconnected', updateUserCount);
    socket.on('typing', showUserTyping);
});
