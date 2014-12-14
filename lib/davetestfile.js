var game = require('./game');

var theGame = new game.Game(['FestivalCard', 'MarketCard', 
  'LaboratoryCard', 'SmithyCard', 'VillageCard', 'WoodcutterCard']);

theGame.createPlayers(['Dave', 'Ting']);

var dave = theGame.players[0];
var ting = theGame.players[1];
// console.log(theGame);

var display = function(player) {
  console.log("Displaying: " + player.name)
  console.log("discard: " + player.discardPile.length);
  console.log("hand: " + player.hand.length);
  console.log("deck: " + player.deck.length);
}


// var cardsIn = function(arr) {
//   output = "";
//   arr.forEach(card) {
//     output += " - " + card.name;
//   }
// }

dave.discard(dave.hand[2], dave.hand);
console.log("discarding");
display(dave);

dave.trash(dave.hand[3], dave.hand);
console.log("trashing");
display(dave);

dave.cleanUpPhase();
console.log("cleaning up");
display(dave);



