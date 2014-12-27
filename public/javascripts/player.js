var Player = function (name, game) {
  this.game = game;
  this.name = name;
  this.deck = [];
  this.hand = [];
  this.discardPile = [];
  this.playArea = [];

  for (var i = 1; i <= 10; i++) {
    if (i <= 7) {
      this.gainCard('CopperCard');
    } else {
      this.gainCard('EstateCard');
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

  var numPlayAreaCards = thePlayArea.length;
  for (var i = 0; i < numPlayAreaCards; i++) {
    theDiscardPile.push(thePlayArea.pop());
  };
  this.playArea = [];
  var handLength = this.hand.length;
  for (var j = 0; j < handLength; j++) {
    theDiscardPile.push(theHand.pop());
  }
  this.hand = []
  this.drawCards(5);
}

Player.prototype.gainCard = function (cardName) {
  this.game.supply[cardName]--;
  var newCard = new cardConstructors[cardName]();
  this.discardPile.push(newCard);

  // update card count on page
  var isKingdom = true;
  var cardPath = getCardPath(cardName, true);
  var cardSelect = 'img.supply-kingdom[src="' + cardPath + '"]';
  // HACK
  if ( $(cardSelect).length == 0 ) {
    isKingdom = false;
    cardPath = getCardPath(cardName, false);
    cardSelect = 'img.supply-nonaction[src="' + cardPath + '"]';
  };

  $(cardSelect).prev().text(this.game.supply[cardName]);
  
  // when card count reaches 0, change img to back.jpg and remove click event
  if (this.game.supply[cardName] == 0) {
    var noCard = $(cardSelect);
    cardPath = '/images/cards/back.jpg';
    noCard.attr('src', cardPath);

    // don't unbind mouseleave event, since the player buying the card has the
    // mouse on the card and has to 'leave' to hide the big version
    noCard.off('mouseenter');
    noCard.removeClass('supply-nonaction');
    noCard.removeClass('supply-kingdom');
    noCard.addClass('supply-none');

    // var noCard = $(cardSelect);
    // cardPath = '/images/cards/back.jpg';
    // noCard.attr('src', cardPath);
    // noCard.off('mouseenter');

    // if (isKingdom) {
    //   cardSelect = 'img.supply-kingdom[src="' + cardPath + '"]';
    //   noCard.parents('#area-supply-kingdom').off('click', cardSelect);
    //   console.log(noCard.parents('#area-supply-kingdom'));
    // } else {
    //   cardSelect = 'img.supply-nonaction[src="' + cardPath + '"]';
    //   noCard.parents('#area-supply-nonaction').off('click', cardSelect);
    //   console.log(noCard.parents('#area-supply-nonaction'));
    // };

    // noCard.off('click');
    // noCard.off('mouseover');
    // console.log(noCard);
    
    // if (isKingdom) {
    //   cardSelect = 'img.supply-kingdom[src="' + cardPath + '"]';
    //   noCard.parents('#area-supply-kingdom').off('click', cardSelect);
    //   console.log(noCard.parents('#area-supply-kingdom'));
    // } else {
    //   cardSelect = 'img.supply-nonaction[src="' + cardPath + '"]';
    //   noCard.parents('#area-supply-nonaction').off('click', cardSelect);
    //   console.log(noCard.parents('#area-supply-nonaction'));
    // };

    // console.log('after parents');

    // noCard.off('mouseover');
    // noCard.off('mouseout');
  };
};

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
  
  $('img#deck').prev().text(theDeck.length);
}; 

Player.prototype.gainAction = function(num) {
  $("#actionCount").text(Number($("#actionCount").text()) + Number(num));
};

Player.prototype.gainCoin = function(num) {
  $("#coinCount").text(Number($("#coinCount").text()) + Number(num));
};

Player.prototype.gainBuy = function(num) {
  $("#buyCount").text(Number($("#buyCount").text()) + Number(num));
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
  for(var j, x, i = deck.length; i; j = 0) {
    j= Math.floor(Math.random() * i);
    x = deck[--i];
    deck[i] = deck[j];
    deck[j] = x;
  }
};