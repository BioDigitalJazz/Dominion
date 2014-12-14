function Card (id, name, cost, image) {
  this.id = id;
  this.name = name;
  this.cost = cost;
  this.image = image;
  this.types = {
    "kingdom": false,
    "action": false,
    "treasure": false,
    "victory": false,
    "curse": false,
    "attack": false,
    "reaction": false
  };
};


// Action Cards have their own child prototype of Cards 
// The other cards do not

function ActionCard(id, name, cost, image) {
  Card.call(this, id, name, cost, image);
  this.types.action = true;
  this.effects = {};
};

ActionCard.prototype = Object.create(Card.prototype);
ActionCard.prototype.constructor = ActionCard;

ActionCard.prototype.play = function(player) { 
  var ef = this.effects;
  if (ef["drawCard"])   { player.drawCard(ef["drawCard"]); };
 
  if (ef["gainCard"])   { player.gainCard(ef["gainCard"]); };
  if (ef["gainAction"]) { player.gainAction(ef["gainAction"]); };
  if (ef["gainCoin"])   { player.gainCoin(ef["gainCoin"]); };
  if (ef["gainBuy"])    { player.gainBuy(ef["gainBuy"]); };
 
  if (ef["revealCard"]) { player.revealCard(ef["revealCard"]); };
  if (ef["discard"])    { player.discard(ef["discard"]); };
  if (ef["trash"])      { player.trash(ef["trash"]); };
};

function FestivalCard() {
  ActionCard.call(this, 14, 'Festival', 5, '/images/cards/festival.jpg');
  this.types.action = true;
  this.effects["gainAction"]  = 2;
  this.effects["gainBuy"]     = 1;
  this.effects["gainCoin"]    = 2;
};

FestivalCard.prototype = Object.create(ActionCard.prototype);
FestivalCard.prototype.constructor = FestivalCard;

function LaboratoryCard() {
  ActionCard.call(this, 16, 'Laboratory', 5, '/images/cards/laboratory.jpg');
  this.types.action = true;
  this.effects["drawCard"]    = 2;
  this.effects["gainAction"]  = 1;
};

LaboratoryCard.prototype = Object.create(ActionCard.prototype);
LaboratoryCard.prototype.constructor = LaboratoryCard;

function MarketCard() {
  ActionCard.call(this, 19, 'Market', 5, '/images/cards/market.jpg');
  this.types.action = true;
  this.effects["drawCard"]    = 1;
  this.effects["gainAction"]  = 1;
  this.effects["gainBuy"]     = 1;
  this.effects["gainCoin"]    = 1;
};

MarketCard.prototype = Object.create(ActionCard.prototype);
MarketCard.prototype.constructor = MarketCard;

function SmithyCard() {
  ActionCard.call(this, 25, 'Smithy', 4, '/images/cards/smithy.jpg');
  this.types.action = true;
  this.effects["drawCard"]    = 3;
};

SmithyCard.prototype = Object.create(ActionCard.prototype);
SmithyCard.prototype.constructor = SmithyCard;

function VillageCard() {
  ActionCard.call(this, 29, 'Village', 3, '/images/cards/village.jpg');
  this.types.action = true;
  this.effects["drawCard"]    = 1;
  this.effects["gainAction"]  = 2;
};

VillageCard.prototype = Object.create(ActionCard.prototype);
VillageCard.prototype.constructor = VillageCard;

function WoodcutterCard() {
  ActionCard.call(this, 31, 'Woodcutter', 3, '/images/cards/woodcutter.jpg');
  this.types.action = true;
  this.effects["gainBuy"]     = 1;
  this.effects["gainCoin"]    = 2;
};

WoodcutterCard.prototype = Object.create(ActionCard.prototype);
WoodcutterCard.prototype.constructor = WoodcutterCard;


exports.FestivalCard = FestivalCard;
exports.MarketCard = MarketCard;
exports.LaboratoryCard = LaboratoryCard;
exports.SmithyCard = SmithyCard;
exports.VillageCard = VillageCard;
exports.WoodcutterCard = WoodcutterCard;