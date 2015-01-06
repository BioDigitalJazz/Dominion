var Player = function (name, game) {
  this.game = game;
  this.name = name;
  this.state = 'normal';
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
  this.drawCard(5);
};

Player.prototype.setState = function(state) {
  this.state = state;
}

//check for a type of card in a given array
Player.prototype.blankCardInBlank = function(cardType, cardLocation) {
  for (var i = 0; i < cardLocation.length; i++) {
    if (cardLocation[i].types[cardType]) {
      return true;
    }
  }
  return false;
}

Player.prototype.handContains = function(cardName) {
  for (var i = 0; i < this.hand.length; i++) {
    if (this.hand[i].name == cardName) {
      // return i;           // returns the index of the card
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

Player.prototype.cleanUpPhase = function(waitTime) {
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
  this.hand = [];
  this.drawCard(5, 800);
}

Player.prototype.gainCard = function (cardName) {
  this.game.supply[cardName]--;
  updateCardCount(cardName);
  console.log(cardName);

  var newCard = new cardConstructors[cardName]();
  this.discardPile.push(newCard);

  if (this.game.round > 0)
    displayDiscard(this, cardName);
};

Player.prototype.drawCard = function(num, waitTime, dontShowHand) {
  var theHand = this.hand;
  var theDiscardPile = this.discardPile;
  var theDeck = this.deck;

  for (var i = 1; i <= num; i++) {
    if (theDeck.length === 0) {
      this.replenishDeck();
      waitTime = 1200;
    };
    theHand.push(theDeck.pop());
  };

  $('img#deck').prev().text(theDeck.length);
  if (dontShowHand === undefined)
    this.showHand(waitTime);
};

Player.prototype.showHand = function(waitTime) {
  var wait = (waitTime === undefined ? 0 : waitTime);
  $(".handcard").hide(wait);
  var thePlayer = this;
  var theHand = this.hand;

  setTimeout(function() {
    $(".handcard").remove();
    for (var i = 0; i < theHand.length; i++)
      thePlayer.addToHand(i);
  }, wait);
};

Player.prototype.addToHand = function (index) {
  var handArea = $("#area-player-hand");
  var imgSrc = "/images/cards/" + this.hand[index].name.toLowerCase() + ".jpg";
  var imgId = "handcard" + index;
  var imgClass = "handcard";

  setTimeout( function() {
    handArea.append('<img src= \"' + imgSrc + '\" class=\"' + imgClass + '\" id=\"' + imgId + '\">');
  }, index * 100);
};

Player.prototype.replenishDeck = function() {
  var discards = this.discardPile.length;
  for (var j = 0; j < discards; j++) {
    this.deck.push(this.discardPile.pop());
  };
  this.shuffleDeck();
  if (this.game.round > 0)
    moveDiscardToDeck(this);
};

function moveDiscardToDeck(player) {
  var discardP = $("img#discard-pile");
  var moveElem = discardP.clone().appendTo('#area-discard-pile');
  
  setTimeout( function() {
    moveElem.addClass('moveToDeck');
    setTimeout( function() { moveElem.remove() }, 600);
    discardP.attr('src', '/images/cards/back.jpg');
  }, 600);
};

Player.prototype.revealCards = function(num) {
  if (this.deck.length < num) {
    this.replenishDeck();
  }
  return this.deck.slice(this.deck.length - num);
}

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
  displayDiscard(this, card.name);
};

function displayDiscard (player, cardName) {
  setTimeout( function() {
    $("img#discard-pile").attr('src', getCardPath(cardName, true));
  }, 200);
};

Player.prototype.trash = function(card, cardLocation) {
  cardLocation.splice(cardLocation.indexOf(card), 1);
};

Player.prototype.displayTrash = function(cardName, cardArea) {
  var cardPath = getCardPath(cardName, true);
  var cardToTrash = $(cardArea).find('img[src="' + cardPath + '"]');
  cardToTrash.hide(400);
  setTimeout(function() { cardToTrash.remove(); }, 400);
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

// return the path to the cropped card img
function getCardPath(cardName, noCrop) {
  var cardPath = '/images/cards/' + cardName.slice(0, -4).toLowerCase();
  var fileExt = '.jpg'; 
  var cardSelect = 'img.supply-card[src="' + cardPath + fileExt + '"]';
  
  // Supply - Kingdom cards: /images/cards/cardname_crop.jpg
  if ($(cardSelect).length === 0 && noCrop === undefined) {
    var fileExt = '_crop.jpg';
  };
  return cardPath + fileExt;
};

// update card counts on game page
function updateCardCount(cardName) {
  var cardPath = getCardPath(cardName);
  var cardSelect = 'img.supply-card[src="' + cardPath + '"]';
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
  };
}; // updateCardCount()