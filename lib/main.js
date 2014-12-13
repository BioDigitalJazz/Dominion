var card = require('./card');
var player = require('./player');

var cards = [];
cards[0] = new card.FestivalCard();
cards[1] = new card.LaboratoryCard();
cards[2] = new card.MarketCard();
cards[3] = new card.SmithyCard();
cards[4] = new card.VillageCard();
cards[5] = new card.WoodcutterCard();

var player1 = new player.Player('Ting');

for (var i = 0; i < 6; i++) {
  cards[i].play(player1);
};
