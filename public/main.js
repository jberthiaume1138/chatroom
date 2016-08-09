$(document).ready(function() {                  // this is all client side
    var socket = io();  // Manager object

    var $input = $('#input');
    var $messages = $('#messages');
    var $nickname = $('#nickname');
    var $notify = $('#notify');

    var message = {};

    $('#btnNickname').on('click', function() {
        var nickname = $nickname.val();
        socket.emit('store nickname', nickname);
    });

    var addMessage = function(message) {
        $messages.append('<p><span class="userheader">' + message.nickname + ' says: </span>' + message.text + '</p>');
    };

    $input.on('keydown', function(event) {
        if (event.keyCode != 13) {
            socket.emit('typing');
        }
        else {      // enter key pressed - send the message up to the server
            socket.emit('stop typing');
            message.nickname = $nickname.val();
            message.text = $input.val();
            addMessage(message);
            socket.emit('chat', message);    // sends to the Socket.IO server
            $input.val('');
        }
    });

    socket.on('message', addMessage);

    var updateUserCount = function (connections) {
        $('#users').empty();
        if (connections === 1) {
            $('#users').append('<p>' + connections + ' user currently online.</p>');
        }
        else {
            $('#users').append('<p>' + connections + ' users currently online.</p>');
        }
    };

    var showUserTyping = function(nickname) {
        $notify.empty();
        $notify.append('User ID: ' + nickname + ' is typing');
    };

    var stopTyping = function(nickname) {
        $notify.empty();
    };

    socket.on('user connected', updateUserCount);
    socket.on('user disconnected', updateUserCount);
    socket.on('typing', showUserTyping);
    socket.on('stop typing', stopTyping);
});
