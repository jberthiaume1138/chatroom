$(document).ready(function() {                  // this is all client side
    var socket = io();  // Manager object

    var $input = $('#input');
    var $messages = $('#messages');
    var $nickname = $('#nickname');

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
            setTimeout(function() {
                socket.emit('typing');
            }, 3000);
        }
        else {      // enter key pressed - send the message up to the server
            message.nickname = $('#nickname').val();
            message.text = $input.val();
            addMessage(message);
            console.log(message);
            socket.emit('chat', message);    // sends to the Socket.IO server
            $input.val('');
        }
    });

    socket.on('message', addMessage);

    var updateUserCount = function (connections) {
        console.log('user state change');
        $('#users').empty();
        if (connections === 1) {
            $('#users').append('<p>' + connections + ' user currently online.</p>');
        }
        else {
            $('#users').append('<p>' + connections + ' users currently online.</p>');
        }
    };

    var showUserTyping = function(nickname) {
        $('#notify').empty();
        $('#notify').append('User ID: ' + nickname + ' is typing');
    };

    socket.on('user connected', updateUserCount);
    socket.on('user disconnected', updateUserCount);
    socket.on('typing', showUserTyping);
});
