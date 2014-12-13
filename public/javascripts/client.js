
$('#start-game').on('click', function() {
  var socket = io();
  var msg = prompt('Message to Send');

  socket.emit('prompt message', msg);
});