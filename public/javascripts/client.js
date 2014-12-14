var socket;
var players = [];

var btnStart = $('#start-game');
btnStart.hide();

$('.join-game').on('click', function() {
  socket = io();
  var playerName = $('#init-game').children('input').first().val();
  socket.emit('player joins', playerName);

  socket.on('player joined', function (newPlayerName) {
    players.push(newPlayerName);
    console.log(players);
  });
});


btnStart.on('click', function() {
  var user = prompt('User Name:');
  socket.emit('user name', user);

  socket.on('new user', function (newUserMsg) {
    $('#start-msg').text(newUserMsg);
  });
});