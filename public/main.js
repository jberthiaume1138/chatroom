$(document).ready(function() {
    var socket = io();

    var $login = $('#login');
    var $chatroom = $('#chatroom');
    var $input = $('#input');
    var $messages = $('#messages');
    var $nickname = $('#nickname');
    var $notify = $('#notify');
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
        else {
            socket.emit('stop typing');
            message.nickname = $nickname.val();
            message.text = $input.val();
            addMessage(message);
            socket.emit('chat', message);
            $input.val('');
        }
    });

    socket.on('message', addMessage);

    var updateJoined = function (connections, nickname, userList) {
        console.log('New user, total now is: ' + Object.keys(userList).length);

        console.log(nickname + ' has joined the channel.');
        $status.append('<p>' + nickname + ' has joined the channel.</p>');

        $userCount.empty();
        if (connections === 1) {
            $userCount.append('<p>' + connections + ' user currently online.</p>');
        }
        else {
            $userCount.append('<p>' + connections + ' users currently online.</p>');
        }

        updateUserList(userList);
    };

    var updateDisconnected = function (connections, departed, userList) {
        console.log('Someone left, now there are: ' + Object.keys(userList).length);

        console.log(departed + ' has left the room.');
        $status.append('<p>' + departed + ' has left the room.</p>');

        // $('#' + departed).remove();

        $userCount.empty();
        if (connections === 1) {
            $userCount.append('<p>' + connections + ' user currently online.</p>');
        }
        else {
            $userCount.append('<p>' + connections + ' users currently online.</p>');
        }

        updateUserList(userList);
    };

    var updateUserList = function(userList) {
        // clears and repopulates the list of online users
        console.log(userList);
        $userList.empty();
        for(var userID in userList) {
            console.log(userList[userID]);
            $userList.append('<p id="' + userID + '">' + userList[userID] + '</p>');
        }
    };

    var showUserTyping = function(nickname) {
        console.log(nickname + 'is typing');
        $notify.empty();
        $notify.append(nickname + ' is typing');
    };

    var stopTyping = function(nickname) {
        $notify.empty();
    };

    socket.on('user joined', updateJoined);
    socket.on('user disconnected', updateDisconnected);

    socket.on('typing', showUserTyping);
    socket.on('stop typing', stopTyping);
});
