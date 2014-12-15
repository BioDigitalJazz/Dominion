var socket = io();

var players = [];
var kingdomCards;
var dbName = 'dominion_game';

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

socket.on('game starts', function (cards) {
  // console.log('game starts');
  // console.log(kingdomCards);
  kingdomCards = cards;

  var deleteRequest = indexedDB.deleteDatabase(dbName);

  deleteRequest.onsuccess = function(e) {
    saveGame();
  };

  deleteRequest.onerror = function(e) {
    console.log("Error: Failed to delete " + dbName);
  };
});

function saveGame() {
  if (!indexedDB) return false;

  console.log('firing saveGame');

  var openRequest = indexedDB.open(dbName, 1);

  openRequest.onupgradeneeded = function(e) {
    console.log('firing onupgradeneeded');
    var thisDB = e.target.result;

    if(!thisDB.objectStoreNames.contains('players')) {
      thisDB.createObjectStore('players');
    };

    if(!thisDB.objectStoreNames.contains('kingdom_cards')) {
      thisDB.createObjectStore('kingdom_cards');
    };
  };

  openRequest.onsuccess = function(e) {
    var db = e.target.result;
    saveToDB(players, "players", db);
    saveToDB(kingdomCards, "kingdom_cards", db);
  } ;

  openRequest.onerror = function(e) {
    console.log('Error: Failed to open indexedDB');
  };
};

function saveToDB(items, storeName, db) {
  var transaction = db.transaction([storeName],"readwrite");
  var store = transaction.objectStore(storeName);
  var request = store.add(items, 1);

  request.onsuccess = function(e) {
    console.log("Saved to " + storeName);

    window.players = players;
    window.kingdomCards = kingdomCards;
    window.location.href = '/game';
  };

  request.onerror = function(e) {
    console.log("Error: Failed to save to " + storeName);
  };
};