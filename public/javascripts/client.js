// window.gameLib = {};

var socket = io();
var players, myPlayerName, myPlayerID;
var kingdomCards;
var dbName = 'dominion_game';
var objStore = 'game';

var pInputs = $('.joined-players');
var btnStart = $('#btn-start-game');
btnStart.hide();

$('#btn-join-game').on('click', function() {
  var input = $(this).prev();
  myPlayerName = input.val();
  socket.emit('player joins', myPlayerName);
  input.prop('disabled', true);
  $(this).hide();
});

socket.on('player joined', function (data) {
  players = data.curPlayers;
  myPlayerID = players.indexOf(myPlayerName);
  sessionStorage.playerID = myPlayerID;

  players.forEach( function (player, index) {
    pInputs.eq(index).val(player);
  });
  if (players.length >= 2) { btnStart.show(); }
});


btnStart.on('click', function() {
  socket.emit('start game');
});

socket.on('game starts', function () {
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
  var openRequest = indexedDB.open(dbName, 1);

  openRequest.onupgradeneeded = function(e) {
    var thisDB = e.target.result;

    if(!thisDB.objectStoreNames.contains(objStore)) {
      thisDB.createObjectStore(objStore);
    };
  };

  openRequest.onsuccess = function(e) {
    var db = e.target.result;
    saveToDB(db);
  } ;

  openRequest.onerror = function(e) {
    console.log('Error: Failed to open indexedDB');
  };
};

function saveToDB(db) {
  var transaction = db.transaction([objStore],"readwrite");
  var store = transaction.objectStore(objStore);
  var request = store.add(myPlayerID, 'playerID');

  request.onsuccess = function(e) {
    console.log("Saved to " + objStore);

    // window.gameLib.socket = socket;
    // window.gameLib.players = players;
    // window.gameLib.kingdomCards = kingdomCards;
    // console.log(window.gameLib);

    window.location.assign('/game');
  };

  request.onerror = function(e) {
    console.log("Error: Failed to save to " + objStore);
  };
};