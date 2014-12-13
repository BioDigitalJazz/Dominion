var socket = io();

var msg = prompt('Message to Send');

socket.emit('Prompt Message', msg);