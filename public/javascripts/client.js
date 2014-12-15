var socket = io();
var players = [];

var pInputs = $('.joined-players');
var btnStart = $('#btn-start-game');
btnStart.hide();

$('#btn-join-game').on('click', function() {
  var input = $(this).prev();
  socket.emit('player joins', input.val());
  input.prop('disabled', true);
  $(this).hide();
});

socket.on('player joined', function (data) {
  players = data.curPlayers;

  players.forEach( function (player, index) {
    pInputs.eq(index).val(player);
  });
  if (players.length >= 2) { btnStart.show(); }
});


btnStart.on('click', function() {
  socket.emit('start game');
});

socket.on('game starts', function () {
  console.log('game starts');
  window.location.href = '/game';
});