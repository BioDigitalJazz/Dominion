function Game(kingdomCards){
  this.players = [];
  this.currentPlayerIndex = 0;
  this.round = 0;
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

Game.prototype.showKingdomCards = function(kingdomCards) {
  var kCardPiles = $('img.supply-kingdom');

  kingdomCards.forEach( function(card, index) {
    var kCard = kCardPiles.eq(index);
    var cardPath = getCardPath(card);
    kCard.attr('src', cardPath);
    kCard.prev().text(10);
  });
};

Game.prototype.showCardCounts = function() {
  for (var cardName in this.supply) {
    var count = this.supply[cardName];
    var cardPath = getCardPath(cardName);
    var cardSelect = 'img.supply-nonaction[src="' + cardPath + '"]';
    
    if ( $(cardSelect).length > 0 )
      $(cardSelect).prev().text(this.supply[cardName]);
  };
};

Game.prototype.startLog = function(kCards) {
  this.logContent = "<u>Players</u>: ";
  this.players.forEach( function(name) {
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
  if (this.currentPlayerIndex == Number(playerID)) {
    this.cleanUp();
    thisPlayer.cleanUpPhase();
    // setTimeout(function() { showMyHand(); }, 1200);
  };

  if (this.currentPlayerIndex == this.players.length - 1) {
    this.currentPlayerIndex = 0;
    this.round++;
  } else {
    this.currentPlayerIndex++;
  };

  if(this.currentPlayerIndex == Number(playerID)) {
    this.displayMessage("It is your turn. Play an action, buy a card, or end the turn.");
    game.logTitle = thisPlayer.name ;
  } else {
    this.displayMessage("Not your turn, please wait.");
  };
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


var playerID = Number(sessionStorage.playerID);
var game, thisPlayer;

var socket = io();
socket.emit('player on game page', playerID);

socket.on('ready to start', function (data) {
  var kingdomCards = data.kingdomCards;
  game = new Game(kingdomCards);
  game.round = 0;
  game.players = data.players;
  thisPlayer = new Player(game.players[playerID], game);
  game.showKingdomCards(kingdomCards);
  game.showCardCounts();
  game.startLog(kingdomCards);

  game.round = 1;
  socket.emit('game created ready to play', playerID);
});

socket.on('player turn', function() {
  if (playerID !== game.currentPlayerIndex) {
    game.displayMessage("Not your turn, please wait.");
  } else {
    game.displayMessage("It is your turn, play an action, or buy a card");
    game.logTitle = thisPlayer.name ;
  };
  // showMyHand();
});


var playCard = function(handIndex) {
  var card = thisPlayer.hand[handIndex];

  if (card.types["Treasure"]) {
    moveCardToPlay(handIndex, card);
    $("#coinCount").text(Number($("#coinCount").text()) + card.worth);
  };

  if (card.types.action) {
    if (Number($("#actionCount").text()) == 0) {
      game.displayMessage("You have no actions left, please buy a card.")
    } else {
      moveCardToPlay(handIndex, card);
      $("#actionCount").text(Number($("#actionCount").text()) - 1);
      
      card.play(thisPlayer);
      checkPlayerState();
      game.logCard(card.name, "Play");
    };
  };
}; // playCard

var moveCardToPlay = function(handIndex, card) {
  thisPlayer.playArea.push(card);
  thisPlayer.hand.splice(handIndex, 1);

  var jqueryCard = $('.handcard').eq(handIndex).hide(400);
  setTimeout(function() { jqueryCard.remove(); }, 400);
  var moveCard = $('<img>').attr('src', card.image).addClass('hand-to-play');
  moveCard.hide().appendTo('#play-area').show(400);
}; // moveCardToPlay

var checkPlayerState = function() {
  switch (thisPlayer.state) {
    case "normal":
      afterAction();
      break;
    case "feast":
      game.displayMessage("Gain a card costing up to 5 coins and trash the Feast card.");
      requireInteraction(null, { action: "gain", coin: 5 });
      break;
    case "mine": 
      game.displayMessage("Trash a Treasure card from your hand. Gain a Treasure card costing up to 3 more.");
      requireInteraction("Cancel");
      break;
    case "moneylender":
      game.displayMessage("Trash a Copper card from your hand. If you do, +3 coins.");
      requireInteraction("Cancel");
      break;
    case "cellar":
      game.displayMessage("Discard any number of cards.  +1 Card per card discarded.");
      requireInteraction("Done");
      break;
    case "chapel":
      game.displayMessage("Trash up to 4 cards from your hand.");
      requireInteraction("Done");
      break;
  }; // switch
}; // checkPlayerState

var requireInteraction = function (buttonText, details) {
  if (details)
    highlightCards(details);

  if (buttonText === null)
    return;

  var btn = $("button#end-turn");
  btn.attr("id", "end-interaction");
  btn.text(buttonText);
  btn.off();
  btn.on('click', endInteraction);
}; // requireInteraction

var highlightCards = function(details) {
  var cardPath, cardSelect;
  // switch (details.action)
  // Highlight cards that the player can gain
  for (var supplyName in game.supply) {
    var supplyCard = new cardConstructors[supplyName]();

    if (details.coin === undefined || details.coin >= supplyCard.cost) {
      cardPath = getCardPath(supplyName);
      cardSelect = 'img.supply-card[src="' + cardPath + '"]';
      $(cardSelect).addClass('highlight-gain');
    };
  };
}; // highlightCards 

var endInteraction = function(noCancel) {
  afterAction();
  unHighlightCards();
  if (noCancel)
    return;

  var btn = $("button#end-interaction");
  btn.attr("id", "end-turn");
  btn.text("End Turn");
  btn.off();
  btn.on('click', endTurn);
}; // endInteraction

var unHighlightCards = function() {
  $('img.highlight-gain').removeClass('highlight-gain');
  $('img.highlight-discard').removeClass('highlight-discard');
  $('img.highlight-trash').removeClass('highlight-trash');
}; // unHighlightCards 

var afterAction = function () {
  thisPlayer.setState("normal");
  if (Number($("#actionCount").text()) == 0) {
    game.displayMessage("Buy a card, or end your turn.");
  } else {
    game.displayMessage("Next action, buy a card, or end your turn.");
  };
}; // afterAction


var buyCard = function(card) {
  var cardName = capStr(card);
  var supplyName = cardName + "Card";
  var cardToBuy = new cardConstructors[supplyName]();

  if (cardToBuy.cost > Number($("#coinCount").text())) {
    console.log("You can't afford that!");
  } else {
    adviseServerGain(supplyName);
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
}; // buyCard

var adviseServerGain = function(supplyName) {
  socket.emit('player gain', supplyName);
};

socket.on('update DB gain', function(supplyName) {
  game.supply[supplyName]--;
  updateCardCount(supplyName);
}); // adviseServerGain

var endTurn = function() {
  if (playerID === game.currentPlayerIndex) {
    adviseServerNextPlayer();
    game.logContent = "";
  };
}; // endTurn


Game.prototype.playerAttack = function(cardName) {
  // this.displayMessage("");
  adviseServerAttack(cardName);
};

var adviseServerAttack = function(cardName) {
  socket.emit('attack', cardName)
};

socket.on('you are being attacked', function(cardName) {
  if (!thisPlayer.handContains("Moat")) {
    switch (cardName) {
      case "witch":
        adviseServerGain("CurseCard"); 
        thisPlayer.gainCard("CurseCard");
        game.displayMessage("Opponent played a Witch card. You gain a Curse.");
        break;
    };
  } else {
    // console.log("Moat card for the win!!!");
    game.displayMessage("Opponent played an attack card. Your Moat card protects you.");
  };
});

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
  var imgElement = this;
  if (playerID !== game.currentPlayerIndex)
    return;

  var handIndex = $(".handcard").index(this);

  if (thisPlayer.state == "normal") {
    playCard(handIndex);
  } else {
    checkCellar(imgElement);
    checkChapel(imgElement);
    checkMine(handIndex);
    checkMoneylender(handIndex);
  };
}; // clickHandCard

function clickKingdomCard() {
  if (playerID !== game.currentPlayerIndex)
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
  if (playerID !== game.currentPlayerIndex)
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

function checkCellar(imgElement) {
  if (thisPlayer.state == "cellar") {
    console.log($(imgElement));
    $(imgElement).toggleClass('highlight');
  }
};

function checkChapel(imgElement) {
  if (thisPlayer.state == "chapel") {
    imgElement.toggleClass('highlight');
  }
};

function checkFeast(card) {
  if (thisPlayer.state == "feast") {
    var cardName = capStr(card);
    var supplyName = cardName + "Card";
    var cardToGain = new cardConstructors[supplyName]();

    if (cardToGain.cost <= 5 && game.supply[supplyName] > 0) {
      thisPlayer.gainCard(supplyName);
      thisPlayer.playArea.pop();
      thisPlayer.displayTrash("FeastCard", "#play-area");

      game.logCard(cardName, "Gain");
      game.logCard("Feast", "Trash");
      endInteraction(true);
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
      thisPlayer.showHand();
      endInteraction();
    };
  };
}; // checkMine

function checkMoneylender(handIndex) {
  if (thisPlayer.state == "moneylender") {
    var theCard = thisPlayer.hand[handIndex];

    if (theCard.name == "Copper") {
      thisPlayer.hand.splice(handIndex, 1);
      thisPlayer.gainCoin(3);
      thisPlayer.showHand();
      game.logCard("Copper", "Trash");
      endInteraction();
    };
  };
}; // checkMoneylender


$(function(){
  initCardDisplay();

  $("#area-player-hand").on("click", ".handcard", clickHandCard);

  $("button#end-turn").on("click", endTurn);

  $("#area-supply-kingdom").on("click", "img.supply-kingdom", clickKingdomCard);

  $("#area-supply-nonaction").on("click", "img.supply-nonaction", clickNonactionCard);
});

