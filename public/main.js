$(document).ready(function() {                  // this is all client side
    var socket = io();  // Manager object

    var $login = $('#login');
    var $chatroom = $('#chatroom');
    var $input = $('#input');
    var $messages = $('#messages');
    var $nickname = $('#nickname');
    var $notify = $('#notify');
    // var $users = $('#users');
    var $userCount = $('#user-count');
    var $userList = $('#user-list');
    var $status = $('#status');

    var message = {};

    $('#btnNickname').on('click', function() {
        var nickname = $nickname.val();
        socket.emit('store nickname', nickname);

        $login.hide();
        $chatroom.show();
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

    var updateJoined = function (connections, nickname) {
        console.log(nickname + ' has joined the channel.');
        $status.append('<p>' + nickname + ' has joined the channel.</p>');

        $userList.append('<p id="' + nickname + '">' + nickname + '</p>');

        $userCount.empty();
        if (connections === 1) {
            $userCount.append('<p>' + connections + ' user currently online.</p>');
        }
        else {
            $userCount.append('<p>' + connections + ' users currently online.</p>');
        }
    };

    var updateDisconnected = function (connections, departed) {
        console.log(departed + ' has left the room.');
        $status.append('<p>' + departed + ' has left the room.</p>');

        // $userList.$('#' + departed).remove();

        $userCount.empty();
        if (connections === 1) {
            $userCount.append('<p>' + connections + ' user currently online.</p>');
        }
        else {
            $userCount.append('<p>' + connections + ' users currently online.</p>');
        }
    };

    var showUserTyping = function(nickname) {
        $notify.empty();
        $notify.append(nickname + ' is typing');
    };

    var stopTyping = function(nickname) {
        $notify.empty();
    };

    // socket.on('user connected', updateJoined);

    socket.on('user joined', updateJoined);
    socket.on('user disconnected', updateDisconnected);

    socket.on('typing', showUserTyping);
    socket.on('stop typing', stopTyping);
});
