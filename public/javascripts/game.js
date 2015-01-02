function Game(kingdomCards){
  this.players = [];
  this.currentPlayerIndex = 0;
  this.supply = {};
  
  this.supply['ProvinceCard'] = 8;
  this.supply['DuchyCard'] = 8;
  this.supply['EstateCard'] = 14;
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
  return this.players[this.currentPlayerIndex];
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

Game.prototype.startLog = function(pNames, kCards) {
  this.logContent = "<u>Players</u>: ";
  pNames.forEach( function(name) {
    this.logContent += (name + ', ');
  }, this);

  this.logContent = this.logContent.slice(0, -2) + "<br /><u>Kingdom Cards</u><br />&nbsp;&nbsp;";
  kCards.forEach( function(kCard) {
    this.logContent += (kCard.slice(0, -4) + ', ');
  }, this);

  this.addLog("The Game Starts", this.logContent.slice(0, -2));
  this.logContent = "";
};

Game.prototype.addLog = function(title, content) {
  if (content.substr(-2, 2) == ", ")
    content = content.slice(0, -2)
  var logStr = "=== " + title + ' === <br />' + content;
  var logBox = $('#log-box');
  $('<p>').html(logStr).appendTo(logBox);

  logBox.animate({ scrollTop: logBox[0].scrollHeight }, 800);
};

Game.prototype.logCard = function (cardName, logType) {
  if (this.logContent.indexOf(logType) == -1) {
    if (this.logContent.substr(-2, 2) == ", ")
      this.logContent += "<br>";
    this.logContent += ("<u>" + logType + "</u>: ");
  };
  this.logContent += (cardName + ", ");
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
  if(this.currentPlayerIndex == Number(playerID)) {
    this.cleanUp();
    this.getCurrentPlayer().cleanUpPhase();
    setTimeout(function() { showMyHand(); }, 1200);
  }

  if (this.currentPlayerIndex == this.players.length - 1) {
    this.currentPlayerIndex = 0;
    sessionStorage.gameRound++;
  } else {
    this.currentPlayerIndex++;
  }

  if(this.currentPlayerIndex == Number(playerID)) {
    this.displayMessage("It is your turn, play an action, or buy a card.");
    game.logTitle = thisPlayer.name ;
  } else {
    this.displayMessage("Not your turn, please wait.");
  }
};

Game.prototype.gameEnd = function(){
  return (supply['province'] == 0);
};

// Game.prototype.triggerShowHand = function() {
//   showMyHand();
// };



// Game.prototype.makePlayerReveal(targetPlayer, numOfCards) {

// };

// Game.prototype.makePlayerDiscard(targetPlayer, numOfCards) {

// };

// Game.prototype.makePlayerGain(targetPlayer, card) {

// };


var playerID = sessionStorage.playerID;
var game, thisPlayer;

var socket = io();
socket.emit('player on game page', playerID);

socket.on('ready to start', function (data) {
  var kingdomCards = data.kingdomCards;
  var players = data.players;
  
  sessionStorage.gameRound = 0;
  game = new Game(kingdomCards);
  game.createPlayers(players);
  game.showKingdomCards(kingdomCards);
  game.showCardCounts();
  game.startLog(players, kingdomCards);
  thisPlayer = game.players[playerID];
  sessionStorage.gameRound = 1;
  socket.emit('game created ready to play', playerID);
});

socket.on('player turn', function() {
  if (parseInt(playerID) !== game.currentPlayerIndex) {
    game.displayMessage("Not your turn, please wait.");
  } else {
    game.displayMessage("It is your turn, play an action, or buy a card");
    game.logTitle = thisPlayer.name ;
  };
  showMyHand();
});

var showMyHand = function() {
  $(".handcard").remove();
  var cardsInHand = thisPlayer.hand;

  for (var i = 0; i < cardsInHand.length; i++)
    addToHand(cardsInHand, i);
};

var addToHand = function (cards, index) {
  var handArea = $("#area-player-hand");
  var imgSrc = "/images/cards/" + cards[index].name.toLowerCase() + ".jpg";
  var imgId = "handcard" + index;
  var imgClass = "handcard";

  setTimeout( function() {
    handArea.append('<img src= \"' + imgSrc + '\" class=\"' + imgClass + '\" id=\"' + imgId + '\">');
  }, index * 100);
};


var playCard = function(handIndex) {
  var card = thisPlayer.hand[handIndex]

  if (card.types["Treasure"]) {
    moveCardToPlay($('.handcard').eq(handIndex), card);
    $("#coinCount").text(Number($("#coinCount").text()) + card.worth);
    playerAction(handIndex, "moveToPlayArea");
  };

  if (card.types.action) {
    if (Number($("#actionCount").text()) == 0) {
      game.displayMessage("You have no actions left, please buy a card.")
    } else {
      moveCardToPlay($('.handcard').eq(handIndex), card);
      $("#actionCount").text(Number($("#actionCount").text()) - 1);
      playerAction(handIndex, "moveToPlayArea");
      card.play(thisPlayer);

      switch (thisPlayer.state) {
        case "mine": 
          game.displayMessage("Trash a Treasure card from your hand. Gain a Treasure card costing up to 3 more.");
      }

      // onhold is a temp name for the player's state
      if (thisPlayer.state == "onhold")
        resolveInteraction();
      
      setTimeout(function() { showMyHand(); }, 400);
      game.logCard(card.name, "Play");
    };
  };
}; // playCard()

var moveCardToPlay = function(jqueryCard, card) {
  jqueryCard.hide(400);
  if (card.name != "Feast") {
    setTimeout( function() {
      jqueryCard.remove();
      var moveCard = $('<img>').attr('src', card.image).addClass('hand-to-play');
      moveCard.hide().appendTo('#play-area').show(400);
    }, 400);
  };
};

var playerAction = function(cardIndex, theFunction) { 
  if (theFunction == "moveToPlayArea") {
    var theCard = thisPlayer.hand[cardIndex]
    thisPlayer.playArea.push(theCard);
    thisPlayer.hand.splice(cardIndex, 1);

    if (theCard.name == "Feast") {
      thisPlayer.playArea.pop();    // Feast gets trashed when played
    };
  };
};

var resolveInteraction = function () {
  var btn = $("button#end-turn");
  btn.attr("id", "done-interact");
  btn.text("Done");
  btn.off();

  btn.on('click', function() {
    thisPlayer.state = "normal";
    btn.attr("id", "end-turn");
    btn.text("End Turn");
    btn.off();
    btn.on('click', endTurn);
    console.log("interaction done");
  });
};

var buyCard = function(card) {
  var cardName = capStr(card);
  var supplyName = cardName + "Card";
  var cardToBuy = new cardConstructors[supplyName]();

  if (cardToBuy.cost > Number($("#coinCount").text())) {
    console.log("You can't afford that!");
  } else {
    adviseServerBuy(supplyName);
    thisPlayer.gainCard(supplyName);
    $("#coinCount").text(Number($("#coinCount").text()) - cardToBuy.cost);
    game.logCard(cardName, "Buy"); 
    
    if (Number($("#buyCount").text()) <= 1) {
      endTurn();
    } else {
      $("#buyCount").text(Number($("#buyCount").text()) - 1);
      game.displayMessage("still more buys:" + $("#buyCount").text());
    };
  };
}; // buyCard()

var adviseServerBuy = function(supplyName) {
  socket.emit('player buy', supplyName);
};

socket.on('update DB buy', function(supplyName) {
  game.supply[supplyName]--;
  updateCardCount(supplyName);
});

var endTurn = function() {
  if (thisPlayer == game.getCurrentPlayer()) {
    adviseServerNextPlayer();
    game.logContent = "";
  };
};

var adviseServerNextPlayer = function() {
  socket.emit('next player', { logTitle: game.logTitle, logContent: game.logContent });
};

socket.on('update DB next player', function(data) {
  game.addLog(data.logTitle, data.logContent);
  game.nextPlayer();
});

// capitalize card name
function capStr(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
};

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


function clickHandCard() {
  if (thisPlayer !== game.getCurrentPlayer())
    return;

  var handIndex = $(".handcard").index(this);

  if (thisPlayer.state == "normal") {
    playCard(handIndex);
  } else {
    checkMine(handIndex);
  };
}; // clickHandCard

function clickKingdomCard() {
  if (thisPlayer !== game.getCurrentPlayer())
    return;

  var supplyIndex = $("img.supply-kingdom").index(this);
  var imgSource = $(this).attr('src');
  var cardName = imgSource.substring(14, (imgSource.length - 9));

  if (thisPlayer.state == "normal") {
    buyCard(cardName);
  } else {
    checkFeast(cardName);
  }; 
}; // clickKingdomCard

function clickNonactionCard() {
  if (thisPlayer !== game.getCurrentPlayer())
    return;

  var supplyIndex = $("img.supply-nonaction").index(this);
  var imgSource = $(this).attr('src');
  var cardName = imgSource.substring(14, (imgSource.length - 4));

  if (thisPlayer.state == "normal") {
    buyCard(cardName);
  } else {
    checkFeast(cardName);
  }; 
}; // clickNonactionCard

function checkFeast(card) {
  if (thisPlayer.state == "feast") {
    var cardName = capStr(card);
    var supplyName = cardName + "Card";
    var cardToGain = new cardConstructors[supplyName]();

    if (cardToGain.cost <= 5 && game.supply[supplyName] > 0) {
      thisPlayer.gainCard(supplyName);
      game.logCard(cardName, "Gain");
      game.logCard("Feast", "Trash");
      thisPlayer.setState("normal");
    };
  };
}; // checkFeast

function checkMine(handIndex) {
  if (thisPlayer.state == "mine") {
    var theCard = thisPlayer.hand[handIndex];
    
    if (theCard.types["Treasure"]) {
      if (theCard.name == "Copper") {
        thisPlayer.hand[handIndex] = new cardConstructors["SilverCard"]();
        game.supply["SilverCard"] -= 1;
        game.logCard("Silver", "Gain");
        game.logCard("Copper", "Trash");
      } else {
        thisPlayer.hand[handIndex] = new cardConstructors["GoldCard"]();
        game.supply["GoldCard"] -= 1;
        game.logCard("Gold", "Gain");
        game.logCard("Silver", "Trash");
      };
      showMyHand();
      thisPlayer.setState("normal");
    };
  };
}; // checkMine


$(function(){
  initCardDisplay();

  $("#area-player-hand").on("click", ".handcard", clickHandCard);

  $("button#end-turn").on("click", endTurn);

  $("#area-supply-kingdom").on("click", "img.supply-kingdom", clickKingdomCard);

  $("#area-supply-nonaction").on("click", "img.supply-nonaction", clickNonactionCard);
});

