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
  theGame = this;
  playerNames.forEach( function(name) {
    theGame.players.push(new Player(name, theGame));
  })
};

Game.prototype.getCurrentPlayer = function() {
  return this.players[this.currentPlayerIndex];
};

Game.prototype.showKingdomCards = function(kingdomCards) {
  var kCardPiles = $('.supply-kingdom');

  kingdomCards.forEach( function(card, index) {
    var cardPath = '/images/cards/' + card.slice(0, -4).toLowerCase() + '_crop.jpg';
    kCardPiles.eq(index).attr('src', cardPath);
  });
};

Game.prototype.displayMessage = function(message) {
  $('#play-prompt').text(message);
};

Game.prototype.nextPlayer = function(){
  if (this.currentPlayerIndex == this.players.length - 1) {
    this.currentPlayerIndex = 0;
  } else {
    this.currentPlayerIndex++;
  }
};

Game.prototype.gameEnd = function(){
  return (supply['province'] == 0);
};

// Game.prototype.makePlayerReveal(targetPlayer, numOfCards) {

// };

// Game.prototype.makePlayerDiscard(targetPlayer, numOfCards) {

// };

// Game.prototype.makePlayerGain(targetPlayer, card) {

// };

// === Ting ===

// var dbName = 'dominion_game';
// var objStore = 'game';
// var openRequest = indexedDB.open(dbName, 1);

// openRequest.onsuccess = function(e) {
//   var db = e.target.result;
//   var transaction = db.transaction([objStore]);
//   var store = transaction.objectStore(objStore);
//   var idRequest = store.get('playerID');

//   idRequest.onsuccess = function(event) {
//     playerID = idRequest.result;
//     console.log(playerID);
//   };

//   idRequest.onerror = function(event) {
//     console.log('Error: ')
//   };
// };

// openRequest.onerror = function(e) {
//   console.log('Error: Failed to open indexedDB');
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

  socket.emit('game created ready to play', playerID);
});

socket.on('player turn', function() {
  if (parseInt(playerID) !== game.currentPlayerIndex){
    game.displayMessage("Not your turn, please wait.")
  } else {
    game.displayMessage("It is your turn, play an action, or buy a card")
    showMyHand();
  }
});

$('.supply-kingdom-orig').hide();
$('.supply-kingdom').hover(showOrig, hideOrig);

function showOrig() {
  var cropImg = $(this);
  var origImg = cropImg.next();
  var origUrl = cropImg.attr('src').replace('_crop', '');

  origImg.attr('src', origUrl);
  origImg.show(400);
};

function hideOrig() {
  $(this).next().hide(400);
};

var showMyHand = function() {
  var hand = $("#area-player-hand");
  var cardsInHand = game.players[playerID].hand;
  console.log(cardsInHand);
  for (var i = 0; i < cardsInHand.length; i++) {
    var aCard = cardsInHand[i]
    var imagesrc = "/images/cards/" + aCard.name.toLowerCase() + ".jpg";
    var imageid = "handcard" + i;
    hand.append('<img src= \"' + imagesrc + '\" id=\"' + imageid + '\">');
  };
};


// var gamePlayers = window.gameLib.players;
// var kingdomCards = window.gameLib.kingdomCards;

// === Ting ===

