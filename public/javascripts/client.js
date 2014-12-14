var socket = io();
var players = [];

var pInputs = $('.joined-players');
var btnStart = $('#btn-start-game');
btnStart.hide();


socket.on('player joined', function (curPlayers) {
  players = curPlayers;

  players.forEach( function (player, index) {
    pInputs.eq(index).val(player);
  });
  if (players.length >= 2) { btnStart.show(); }
});


$('#btn-join-game').on('click', function() {
  var input = $(this).prev();
  socket.emit('player joins', input.val());
  input.prop('disabled', true);
  $(this).hide();
});


btnStart.on('click', function() {
  var user = prompt('User Name:');
  socket.emit('user name', user);

  socket.on('new user', function (newUserMsg) {
    $('#start-msg').text(newUserMsg);
  });
});