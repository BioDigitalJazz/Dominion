var game = require('./game');

var theGame = new game.Game(['FestivalCard', 'MarketCard', 
  'LaboratoryCard', 'SmithyCard', 'VillageCard', 'WoodcutterCard']);

theGame.createPlayers(['Dave', 'Ting']);
console.log(theGame.players[0].hand);
console.log(theGame.players[0].hand[0].name);

