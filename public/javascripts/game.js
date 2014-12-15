function Game(kingdomCards){
  this.players = [];
  this.currentPlayerIndex = 0;
  this.supply = {};
  
  this.supply['ProvinceCard'] = 8;
  this.supply['DuchyCard'] = 8;
  this.supply['EstateCard'] = 14;
  this.supply['GoldCard'] = 30;
  this.supply['SilverCard'] = 40;
  this.supply['CopperCard'] = 60;
  this.supply['CurseCard'] = 10;

  theSupply = this.supply;
  kingdomCards.forEach(function(kcard) {
    theSupply[kcard] = 10;
  });
}

Game.prototype.createPlayers = function(playerNames) {
  theGame = this;
  playerNames.forEach( function(name) {
    theGame.players.push(new player.Player(name, theGame));
  })
}

Game.prototype.getCurrentPlayer = function() {
  return this.players[currentPlayerIndex];
};

Game.prototype.nextPlayer = function(){
  if (currentPlayerIndex == this.players.length - 1) {
    currentPlayerIndex = 0;
  } else {
    currentPlayerIndex++;
  }
};

Game.prototype.gameEnd = function(){
  return (supply['province'] == 0);
};

// Game.prototype.makePlayerReveal(targetPlayer, numOfCards) {

// };

// Game.prototype.makePlayerDiscard(targetPlayer, numOfCards) {

// };

// Game.prototype.makePlayerGain(targetPlayer, card) {

// };

// === Ting ===

var playerID = sessionStorage.playerID;
console.log(playerID);

// var dbName = 'dominion_game';
// var objStore = 'game';
// var openRequest = indexedDB.open(dbName, 1);

// openRequest.onsuccess = function(e) {
//   var db = e.target.result;
//   var transaction = db.transaction([objStore]);
//   var store = transaction.objectStore(objStore);
//   var idRequest = store.get('playerID');

//   idRequest.onsuccess = function(event) {
//     playerID = idRequest.result;
//     console.log(playerID);
//   };

//   idRequest.onerror = function(event) {
//     console.log('Error: ')
//   };
// };

// openRequest.onerror = function(e) {
//   console.log('Error: Failed to open indexedDB');
// };

var socket = io();
socket.emit('player starts', playerID);

// === Ting ===


// var gamePlayers = window.gameLib.players;
// var kingdomCards = window.gameLib.kingdomCards;


// console.log(kingdomCards);


// var game = Game(kingdomCards);
// game.createPlayers(gamePlayers);

// console.log(game.getCurrentPlayer());
// game.nextPlayer();
// console.log(game.getCurrentPlayer());