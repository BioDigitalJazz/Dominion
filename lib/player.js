var card = require('./card');

var Player = function (name, game) {
  this.game = game;
  this.name = name;
  this.deck = [];
  this.hand = [];
  this.discardPile = [];
  this.playArea = [];

  for (i = 1; i <= 10; i++) {
    if (i <= 7) {
      this.gainCard('FestivalCard');
    } else {
      this.gainCard('VillageCard');
    }
  };
  this.drawCards(5);
};

//check for a type of card in a given array
Player.prototype.blankCardInBlank = function(cardType, cardLocation) {
  for (i = 0; i < cardLocation.length; i++) {
    if (cardLocation[i].types[cardType]) {
      return true;
    }
  }
  return false;
}

Player.prototype.startTurn = function() {
  var coins = 0;
  var actions = 1;
  var buys = 1;

  if (blankCardInBlank('action', hand)) {
    //prompt player to play action card
  } else {
    //prompt player to buy
  }
}

Player.prototype.cleanUpPhase = function() {
  for (i = 0; i < playArea.length; i++) {
    discardPile.push(playArea[i]);
  }
  playArea = [];
  for (i = 0; i < hand.length; i++) {
    discardPile.push(hand[i]);
  }
  hand = [];
  drawCards(5);
}

Player.prototype.drawCards = function(num) {
  for (i = 1; i <= num; i++) {
    if (this.deck.length = 0) {
      this.deck = this.discardPile;
      this.discardPile = [];
      this.shuffleDeck();
    }
    this.hand.push(this.deck.pop());
  }
}; 

Player.prototype.gainCard = function (cardName) {
  this.game.supply[cardName]--;
  console.log('Object.create(card.' + cardName + '.prototype)');
  var newCard = eval('Object.create(new card.' + cardName + '.prototype)');
  console.log(newCard);
  this.discardPile.push(newCard);
};

Player.prototype.gainAction = function(num) {
  actions += num;
};

Player.prototype.gainCoin = function(num) {
  coins += num;
};

Player.prototype.gainBuy = function(num) {
  buys += num;
};

Player.prototype.revealCard = function(card) {
  console.log('Reveal card(s): ' + num);
};

Player.prototype.discard = function(card, cardLocation) {
  discardPile.push(card);
  cardLocation.splice(cardLocation.indexOf(card), 1);
};

Player.prototype.trash = function(card, cardLocation) {
  cardLocation.splice(cardLocation.indexOf(card), 1);
};

Player.prototype.shuffleDeck = function(){ //v1.0
  for(var j, x, i = deck.length; i; j = Math.floor(Math.random() * i)) {
    x = deck[--i];
    deck[i] = deck[j];
    deck[j] = x;
  }
};


exports.Player = Player;