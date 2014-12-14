var player = require('./player');

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
  return players[currentPlayerIndex];
};

Game.prototype.nextPlayer = function(){
  if (currentPlayerIndex == players.length - 1) {
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

var client = require(./client);
var players = client.players;


exports.Game = Game;
