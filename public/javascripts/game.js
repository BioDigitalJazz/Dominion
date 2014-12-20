function Game(kingdomCards){
  this.players = [];
  this.currentPlayerIndex = 0;
  this.supply = {};
  
  this.supply['ProvinceCard'] = 8;
  this.supply['DuchyCard'] = 8;
  this.supply['EstateCard'] = 8;
  this.supply['GoldCard'] = 30;
  this.supply['SilverCard'] = 40;
  this.supply['CopperCard'] = 60;
  this.supply['CurseCard'] = 10;
  
  theSupply = this.supply;
  kingdomCards.forEach(function(kcard) {
    theSupply[kcard] = 10;
  });
};

Game.prototype.createPlayers = function(playerNames) {
  var theGame = this;
  playerNames.forEach( function(name) {
    theGame.players.push(new Player(name, theGame));
  })
};

Game.prototype.getCurrentPlayer = function() {
  return game.players[game.currentPlayerIndex];
};

Game.prototype.showKingdomCards = function(kingdomCards) {
  var kCardPiles = $('img.supply-kingdom');

  kingdomCards.forEach( function(card, index) {
    var kCard = kCardPiles.eq(index);
    var cardPath = getCardPath(card, true);
    kCard.attr('src', cardPath);
    kCard.prev().text(10);
  });
};

Game.prototype.showCardCounts = function() {
  for (var cardName in this.supply) {
    var count = this.supply[cardName];
    var cardPath = getCardPath(cardName, false);
    var cardSelect = 'img.supply-nonaction[src="' + cardPath + '"]';
    
    if ( $(cardSelect).length > 0 )
      $(cardSelect).prev().text(this.supply[cardName]);
  };
};

Game.prototype.displayMessage = function(message) {
  $('#play-prompt').text(message);
};

Game.prototype.cleanUp = function() {
  $( ".handcard" ).remove();
  $( ".hand-to-play" ).remove();
  $("#actionCount").text("1");
  $("#buyCount").text("1");
  $("#coinCount").text("0");
};

Game.prototype.nextPlayer = function(){
  if(game.currentPlayerIndex == Number(playerID)) {
    game.cleanUp();
    game.getCurrentPlayer().cleanUpPhase();
    showMyHand();
  }

  if (game.currentPlayerIndex == game.players.length - 1) {
    game.currentPlayerIndex = 0;
  } else {
    game.currentPlayerIndex++;
  }

  if(game.currentPlayerIndex == Number(playerID)) {
    game.displayMessage("It is your turn, play an action, or buy a card.");
  } else {
    game.displayMessage("Not your turn, please wait.");
  }
};

Game.prototype.gameEnd = function(){
  return (supply['province'] == 0);
};

Game.prototype.triggerShowHand = function() {
  showMyHand();
};



// Game.prototype.makePlayerReveal(targetPlayer, numOfCards) {

// };

// Game.prototype.makePlayerDiscard(targetPlayer, numOfCards) {

// };

// Game.prototype.makePlayerGain(targetPlayer, card) {

// };


var playerID = sessionStorage.playerID;
var game;

var socket = io();
socket.emit('player on game page', playerID);

socket.on('ready to start', function (data) {
  var kingdomCards = data.kingdomCards;
  var players = data.players;
  
  game = new Game(kingdomCards);
  game.createPlayers(players);
  game.showKingdomCards(kingdomCards);
  game.showCardCounts();
  socket.emit('game created ready to play', playerID);
});

socket.on('player turn', function() {
  if (parseInt(playerID) !== game.currentPlayerIndex){
    game.displayMessage("Not your turn, please wait.")
  } else {
    game.displayMessage("It is your turn, play an action, or buy a card")
  }
  showMyHand();
});

var showMyHand = function() {
  var handArea = $("#area-player-hand");
  $(".handcard").remove();
  var cardsInHand = game.players[playerID].hand;
  for (var i = 0; i < cardsInHand.length; i++) {
    var aCard = cardsInHand[i]
    var imagesrc = "/images/cards/" + aCard.name.toLowerCase() + ".jpg";
    var imageid = "handcard" + i;
    var imageClass = "handcard";
    handArea.append('<img src= \"' + imagesrc + '\" class=\"' + imageClass + '\" id=\"' + imageid + '\">');
  };
};

var moveCardToPlay = function(jqueryCard, card) {
  jqueryCard.hide(400);
  setTimeout( function() {
    jqueryCard.remove();
    var moveCard = $('<img>').attr('src', card.image).addClass('hand-to-play');
    moveCard.hide().appendTo('#play-area').show(400);
  }, 400);
}

var playCard = function(card, handIndex, playerid) {
  if (game.players[playerid] == game.getCurrentPlayer()) {
    var thePlayer = game.players[playerid];

    if (card.types.Treasure) {
      moveCardToPlay($('.handcard').eq(handIndex), card);
      $("#coinCount").text(Number($("#coinCount").text()) + card.worth);
      adviseServerAction("hand", handIndex, thePlayer, "moveToPlayArea");
    }

    if (card.types.action) {
      if (Number($("#actionCount").text()) == 0) {
        game.displayMessage("You have no actions left, please buy a card.")
      } else {
        moveCardToPlay($('.handcard').eq(handIndex), card);
        card.play(thePlayer);
        adviseServerAction("hand", handIndex, thePlayer, "moveToPlayArea");
        setTimeout(function() {
          showMyHand();
        }, 400);
        $("#actionCount").text(Number($("#actionCount").text()) - 1);
      }
    }
  }
};
var buyCard = function(cardName) {
  // name format is CouncilroomCard
  var supplyName = cardName.charAt(0).toUpperCase() + cardName.substring(1) + "Card";
  var cardToBuy = new cardConstructors[supplyName]();
  if (game.players[playerID] !== game.getCurrentPlayer()) {
    console.log("Wait your goddamn turn!");
  } else {
    if (cardToBuy.cost > Number($("#coinCount").text())) {
      console.log("You can't afford that!");
    } else {
      adviseServerBuy(game.players.indexOf(game.getCurrentPlayer()), supplyName);
      $("#coinCount").text(Number($("#coinCount").text()) - cardToBuy.cost);
      if (Number($("#buyCount").text()) <= 1) {
        adviseServerNextPlayer();
      } else {
        $("#actionCount").text(Number($("#actionCount").text()) - 1);
        console.log("still more buys:" + $("#coinCount").text());
      }

    }
  }
};


// var moveToPlayArea = function(card, handIndex, player) {
//   var imgIdentifier = "img#handcard" + handIndex
//   var imgsrc = $(imgIdentifier).attr('src');
//   game.getCurrentPlayer.play

//   console.log(imgsrc);
// };

var adviseServerNextPlayer = function() {
  socket.emit('next player');
}

var adviseServerBuy = function(thePlayer, theCard) {
  socket.emit('player buy', { playerIndex: thePlayer, card: theCard });
}

var adviseServerAction = function(theCardLocation, theCardIndex, thePlayer, theFunctionToPass) {
  socket.emit('player action', { cardLocation: theCardLocation, cardIndex: theCardIndex, 
               playerIndex: game.players.indexOf(thePlayer), functionToPass: theFunctionToPass });
};

socket.on('update DB next player', function() {
  game.nextPlayer();
});

socket.on('update DB buy', function(data) {
  var player = game.players[data.playerIndex];
  var card = data.card;
  player.gainCard(card);
});

socket.on('update DB action', function(data) {
  var theCardLocation = data.cardLocation;
  var theCardIndex = data.cardIndex;
  var thePlayer = game.players[data.playerIndex];
  var theFunction = data.functionToPass;
  
  if (theFunction == "moveToPlayArea") {
    thePlayer.playArea.push(thePlayer.hand[theCardIndex]);
    thePlayer.hand.splice(theCardIndex, 1);
  }
});

function showMore() {
  var smallImg = $(this);
  smallImg.prev().show(400);

  var origImg = smallImg.next();
  var origUrl = smallImg.attr('src').replace('_crop', '');
  origImg.attr('src', origUrl);
  origImg.show(400);
};

function hideMore() {
  $(this).prev().hide(400);
  $(this).next().hide(400);
};

function showCount() {
  $(this).prev().show(400);
};

function hideCount() {
  $(this).prev().hide(400);
};

function initCardDisplay() {
  $('div.card-count').hide();
  $('img.supply-nonaction-orig').hide();
  $('img.supply-kingdom-orig').hide();

  $('img.supply-nonaction').hover(showMore, hideMore);
  $('img.supply-kingdom').hover(showMore, hideMore);
  $('img#deck').hover(showCount, hideCount);
};

$(function(){
  initCardDisplay();
  $("#area-player-hand").on("click", ".handcard", function(event) {
    // var handIndex = event.target.id.slice(-1);
    var handIndex = $(".handcard").index(this);
    playCard(game.getCurrentPlayer().hand[handIndex], handIndex, playerID);
  });

  $("#area-supply-kingdom").on("click", "img.supply-kingdom", function(event) {
    var supplyIndex = $("img.supply-kingdom").index(this);
    var imgSource = $(this).attr('src');
    // src="/images/cards/councilroom_crop.jpg
    //index=0123456789012345678901234567890123
    var cardName = imgSource.substring(14, (imgSource.length - 9));
    buyCard(cardName);
  });

  $("#area-supply-nonaction").on("click", "img.supply-nonaction", function(event) {
    var supplyIndex = $("img.supply-nonaction").index(this);
    var imgSource = $(this).attr('src');
    // src="/images/cards/duchy.jpg"
    //index=01234567890123456789012
    var cardName = imgSource.substring(14, (imgSource.length - 4));
    buyCard(cardName);
  });

});

