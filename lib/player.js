var card = require('./card');

var Player = function (name, game) {
  this.game = game;
  this.name = name;
  this.deck = [];
  this.hand = [];
  this.discardPile = [];
  this.playArea = [];

  for (var i = 1; i <= 10; i++) {
    if (i <= 7) {
      this.gainCard('FestivalCard');
    } else {
      this.gainCard('VillageCard');
    }
  };
  // console.log("discard pile should have 10 before drawing and shuffling : " + this.discardPile.length);
  // console.log("hand should be empty before drawing : " + this.hand.length);
  this.drawCards(5);
  // console.log("hand should have 5 cards after drawing : " + this.hand.length);
};

//check for a type of card in a given array
Player.prototype.blankCardInBlank = function(cardType, cardLocation) {
  for (var i = 0; i < cardLocation.length; i++) {
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
  var theDiscardPile = this.discardPile;
  var theHand = this.hand;
  var thePlayArea = this.playArea;
  for (var i = 0; i < thePlayArea.length; i++) {
    theDiscardPile.push(thePlayArea[i]);
  }
  thePlayArea = [];
  var handLength = theHand.length;
  for (var j = 0; j < handLength; j++) {
    theDiscardPile.push(theHand.pop());
  }
  theHand = [];
  this.drawCards(5);
}

Player.prototype.drawCards = function(num) {
  var theHand = this.hand;
  var theDiscardPile = this.discardPile;
  var theDeck = this.deck;
  for (var i = 1; i <= num; i++) {
    if (theDeck.length == 0) {
      var discards = theDiscardPile.length;
      for (var j = 0; j < discards; j++) {
        theDeck.push(theDiscardPile.pop());
      };
      this.shuffleDeck();
    };

    theHand.push(theDeck.pop());
  };
}; 

Player.prototype.gainCard = function (cardName) {
  this.game.supply[cardName]--;
  this.discardPile.push(new card[cardName]);
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
  this.discardPile.push(card);
  cardLocation.splice(cardLocation.indexOf(card), 1);
};

Player.prototype.trash = function(card, cardLocation) {
  cardLocation.splice(cardLocation.indexOf(card), 1);
};

Player.prototype.shuffleDeck = function(){ //v1.0
  var deck = this.deck;
  for(var j, x, i = deck.length; i; j = Math.floor(Math.random() * i)) {
    x = deck[--i];
    deck[i] = deck[j];
    deck[j] = x;
  }
};


exports.Player = Player;