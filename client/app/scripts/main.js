
var socket = io();

socket.on('files', function (msg) {
    $('#messages').append($('<li>').text(msg.files));
//    console.log(msg);
});
socket.on('change', function (msg) {
    $('#messages').append($('<li>').text(msg));
});
