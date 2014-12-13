
function Game(players, kingdomCards){
  var players = players;
  var currentPlayer = 0;
  var supply = new Hash();

  kingdomCards.each(function(kcard) {
    supply.set(kcard, 10);
  });
  supply.set('province', 8);
  supply.set('duchy', 8);
  supply.set('estate', 8);
  supply.set('gold', 30);
  supply.set('silver', 40);
  supply.set('copper', 46);
  supply.set('curse', 10);

  while (!gameEnd) {
    players[currentPlayer].playerTurn;
    nextPlayer;
  };

}

Game.prototype.nextPlayer = function(){
  if (currentPlayer) == players.length - 1 {
    currentPlayer = 0;
  } else {
    currentPlayer++;
  }
};

Game.prototype.gameEnd = function() {
  return (supply['province'] == 0)
};

Game.prototype.makePlayerReveal(targetPlayer, numOfCards) {

};

Game.prototype.makePlayerDiscard(targetPlayer, numOfCards) {

};

Game.prototype.makePlayerGain(targetPlayer, card) {

};

module.exports = Game;