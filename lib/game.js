
function Game(players, kingdomCards){
  var players = players;
  var currentPlayer = 0;
  var supply = new Hash();

  kingdomCards.each(function(kcard) {
    supply.set(kcard, 10);
  });
  supply.set('ProvinceCard', 8);
  supply.set('DuchyCard', 8);
  supply.set('EstateCard', 14);
  supply.set('GoldCard', 30);
  supply.set('SilverCard', 40);
  supply.set('CopperCard', 60);
  supply.set('CurseCard', 10);

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