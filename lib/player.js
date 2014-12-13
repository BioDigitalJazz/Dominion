var Player = function (name) {
  this.name = name;
  this.deck = [];
  this.hand = [];
  this.discardPile = [];
};

Player.prototype.drawCard = function(num) {
  console.log('Draw card(s): ' + num);
}; 

Player.prototype.gainCard = function (num) {
  // console.log('Player - ' + this.name);
  console.log('Gain card(s): ' + num);
  // this.discardPile.push['New card'];
};

Player.prototype.gainAction = function(num) {
  console.log('Gain action(s): ' + num);
};

Player.prototype.gainCoin = function(num) {
  console.log('Gain coin(s): ' + num);
};

Player.prototype.gainBuy = function(num) {
  console.log('Gain buy(s): ' + num);
};

Player.prototype.revealCard = function(num) {
  console.log('Reveal card(s): ' + num);
};

Player.prototype.discard = function(num) {
  console.log('Discard card(s): ' + num);
};

Player.prototype.trash = function(num) {
  console.log('Trash card(s): ' + num);
};


exports.Player = Player;