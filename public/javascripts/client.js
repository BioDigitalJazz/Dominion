
$('#start-game').on('click', function() {
  var socket = io();

  var user = prompt('User Name:');
  socket.emit('user name', user);

  socket.on('new user', function (newUserMsg) {
    $('#start-msg').text(newUserMsg);
  });
});