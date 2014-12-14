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


// Treasure Cards
function TreasureCard(id, name, cost, image) {
  Card.call(this, id, name, cost, image);
  this.types.Treasure = true;
  this.worth = 0;
};

TreasureCard.prototype = Object.create(Card.prototype);
TreasureCard.prototype.constructor = TreasureCard;


function CopperCard() {
  TreasureCard.call(this, 0, 'Copper', 0, '/images/cards/copper.jpg');
  this.worth = 1;
};

CopperCard.prototype = Object.create(TreasureCard.prototype);
CopperCard.prototype.constructor = CopperCard;


function SilverCard() {
  TreasureCard.call(this, 1, 'Silver', 3, '/images/cards/silver.jpg');
  this.worth = 2;
};

SilverCard.prototype = Object.create(TreasureCard.prototype);
SilverCard.prototype.constructor = SilverCard;


function GoldCard() {
  TreasureCard.call(this, 2, 'Gold', 6, '/images/cards/gold.jpg');
  this.worth = 3;
};

GoldCard.prototype = Object.create(TreasureCard.prototype);
GoldCard.prototype.constructor = GoldCard;


// Victory Cards
function VictoryCard(id, name, cost, image) {
  Card.call(this, id, name, cost, image);
  this.types.Victory = true;
  this.victoryPoints = 0;
};

VictoryCard.prototype = Object.create(Card.prototype);
VictoryCard.prototype.constructor = VictoryCard;


function EstateCard() {
  VictoryCard.call(this, 3, 'Estate', 2, '/images/cards/estate.jpg');
  this.victoryPoints = 1;
};

EstateCard.prototype = Object.create(VictoryCard.prototype);
EstateCard.prototype.constructor = EstateCard;


function DuchyCard() {
  VictoryCard.call(this, 4, 'Duchy', 5, '/images/cards/duchy.jpg');
  this.victoryPoints = 3;
};

DuchyCard.prototype = Object.create(VictoryCard.prototype);
DuchyCard.prototype.constructor = DuchyCard;


function ProvinceCard() {
  VictoryCard.call(this, 5, 'Province', 8, '/images/cards/province.jpg');
  this.victoryPoints = 6;
};

ProvinceCard.prototype = Object.create(VictoryCard.prototype);
ProvinceCard.prototype.constructor = ProvinceCard;


function GardensCard() {
  VictoryCard.call(this, 6, 'Gardens', 4, '/images/cards/gardens.jpg');
  
  // To-Do
  this.victoryPoints = function () { };
};

GardensCard.prototype = Object.create(VictoryCard.prototype);
GardensCard.prototype.constructor = GardensCard;


function CurseCard() {
  Card.call(this, 7, 'Curse', 0, '/images/cards/curse.jpg');
  
  this.victoryPoints = -1;
};

CurseCard.prototype = Object.create(Card.prototype);
CurseCard.prototype.constructor = CurseCard;


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


function AdventurerCard() {
  ActionCard.call(this, 8, 'Adventurer', 6, '/images/cards/adventurer.jpg');
  this.types.action = true;

  // Special Function
  
};

AdventurerCard.prototype = Object.create(ActionCard.prototype);
AdventurerCard.prototype.constructor = AdventurerCard;


function BureaucratCard() {
  ActionCard.call(this, 9, 'Bureaucrat', 4, '/images/cards/bureaucrat.jpg');
  this.types.action = true;
  this.types.attack = true;

  // Special Function
  
};

BureaucratCard.prototype = Object.create(ActionCard.prototype);
BureaucratCard.prototype.constructor = BureaucratCard;


function CellarCard() {
  ActionCard.call(this, 10, 'Cellar', 2, '/images/cards/cellar.jpg');
  this.types.action = true;
  this.effects["gainAction"]  = 1;
  
  // Special Function
  
};

CellarCard.prototype = Object.create(ActionCard.prototype);
CellarCard.prototype.constructor = CellarCard;


function ChancellorCard() {
  ActionCard.call(this, 11, 'Chancellor', 3, '/images/cards/chancellor.jpg');
  this.types.action = true;
  this.effects["gainCoin"]    = 2;
  
  // Special Function
  
};

ChancellorCard.prototype = Object.create(ActionCard.prototype);
ChancellorCard.prototype.constructor = ChancellorCard;


function ChapelCard() {
  ActionCard.call(this, 12, 'Chapel', 2, '/images/cards/chapel.jpg');
  this.types.action = true;
  
  // Special Function
  
};

ChapelCard.prototype = Object.create(ActionCard.prototype);
ChapelCard.prototype.constructor = ChapelCard;


function CouncilRoomCard() {
  ActionCard.call(this, 13, 'CouncilRoom', 5, '/images/cards/councilroom.jpg');
  this.types.action = true;
  this.effects["drawCard"]    = 4;
  this.effects["gainBuy"]     = 1;

  // Special Function
  
};

CouncilRoomCard.prototype = Object.create(ActionCard.prototype);
CouncilRoomCard.prototype.constructor = CouncilRoomCard;


function FeastCard() {
  ActionCard.call(this, 14, 'Feast', 4, '/images/cards/feast.jpg');
  this.types.action = true;

  // Special Function
  
};

FeastCard.prototype = Object.create(ActionCard.prototype);
FeastCard.prototype.constructor = FeastCard;


function FestivalCard() {
  ActionCard.call(this, 15, 'Festival', 5, '/images/cards/festival.jpg');
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


function LibraryCard() {
  ActionCard.call(this, 17, 'Library', 5, '/images/cards/library.jpg');
  this.types.action = true;

  // Special Function
  
};

LibraryCard.prototype = Object.create(ActionCard.prototype);
LibraryCard.prototype.constructor = LibraryCard;


function MarketCard() {
  ActionCard.call(this, 18, 'Market', 5, '/images/cards/market.jpg');
  this.types.action = true;
  this.effects["drawCard"]    = 1;
  this.effects["gainAction"]  = 1;
  this.effects["gainBuy"]     = 1;
  this.effects["gainCoin"]    = 1;
};

MarketCard.prototype = Object.create(ActionCard.prototype);
MarketCard.prototype.constructor = MarketCard;


function MilitiaCard() {
  ActionCard.call(this, 19, 'Militia', 4, '/images/cards/militia.jpg');
  this.types.action = true;
  this.types.attack = true;
  this.effects["gainCoin"]    = 2;

  // Special Function
  
};

MilitiaCard.prototype = Object.create(ActionCard.prototype);
MilitiaCard.prototype.constructor = MilitiaCard;


function MineCard() {
  ActionCard.call(this, 20, 'Mine', 5, '/images/cards/mine.jpg');
  this.types.action = true;

  // Special Function
  
};

MineCard.prototype = Object.create(ActionCard.prototype);
MineCard.prototype.constructor = MineCard;


function MoatCard() {
  ActionCard.call(this, 21, 'Moat', 2, '/images/cards/moat.jpg');
  this.types.action = true;
  this.types.reaction = true;
  this.effects["drawCard"]    = 2;

  // Special Function
  
};

MoatCard.prototype = Object.create(ActionCard.prototype);
MoatCard.prototype.constructor = MoatCard;


function MoneyLenderCard() {
  ActionCard.call(this, 22, 'MoneyLender', 4, '/images/cards/moneylender.jpg');
  this.types.action = true;

  // Special Function
  
};

MoneyLenderCard.prototype = Object.create(ActionCard.prototype);
MoneyLenderCard.prototype.constructor = MoneyLenderCard;


function RemodelCard() {
  ActionCard.call(this, 23, 'Remodel', 4, '/images/cards/remodel.jpg');
  this.types.action = true;

  // Special Function
  
};

RemodelCard.prototype = Object.create(ActionCard.prototype);
RemodelCard.prototype.constructor = RemodelCard;


function SmithyCard() {
  ActionCard.call(this, 24, 'Smithy', 4, '/images/cards/smithy.jpg');
  this.types.action = true;
  this.effects["drawCard"]    = 3;
};

SmithyCard.prototype = Object.create(ActionCard.prototype);
SmithyCard.prototype.constructor = SmithyCard;


function SpyCard() {
  ActionCard.call(this, 25, 'Spy', 4, '/images/cards/spy.jpg');
  this.types.action = true;
  this.types.attack = true;
  this.effects["drawCard"]    = 1;
  this.effects["gainAction"]  = 1;

  // Special Function
  
};

SpyCard.prototype = Object.create(ActionCard.prototype);
SpyCard.prototype.constructor = SpyCard;


function ThiefCard() {
  ActionCard.call(this, 26, 'Thief', 4, '/images/cards/thief.jpg');
  this.types.action = true;
  this.types.attack = true;
  this.effects["gainCoin"]    = 2;

  // Special Function
  
};

ThiefCard.prototype = Object.create(ActionCard.prototype);
ThiefCard.prototype.constructor = ThiefCard;


function ThroneRoomCard() {
  ActionCard.call(this, 27, 'ThroneRoom', 4, '/images/cards/throneroom.jpg');
  this.types.action = true;

  // Special Function
  
};

ThroneRoomCard.prototype = Object.create(ActionCard.prototype);
ThroneRoomCard.prototype.constructor = ThroneRoomCard;


function VillageCard() {
  ActionCard.call(this, 28, 'Village', 3, '/images/cards/village.jpg');
  this.types.action = true;
  this.effects["drawCard"]    = 1;
  this.effects["gainAction"]  = 2;
};

VillageCard.prototype = Object.create(ActionCard.prototype);
VillageCard.prototype.constructor = VillageCard;


function WitchCard() {
  ActionCard.call(this, 29, 'Witch', 5, '/images/cards/witch.jpg');
  this.types.action = true;
  this.types.attack = true;
  this.effects["drawCard"]    = 2;

  // Special Function
  
};

WitchCard.prototype = Object.create(ActionCard.prototype);
WitchCard.prototype.constructor = WitchCard;


function WoodcutterCard() {
  ActionCard.call(this, 31, 'Woodcutter', 3, '/images/cards/woodcutter.jpg');
  this.types.action = true;
  this.effects["gainBuy"]     = 1;
  this.effects["gainCoin"]    = 2;
};

WoodcutterCard.prototype = Object.create(ActionCard.prototype);
WoodcutterCard.prototype.constructor = WoodcutterCard;


exports.CopperCard      = CopperCard;
exports.SilverCard      = SilverCard;
exports.GoldCard        = GoldCard;
exports.EstateCard      = EstateCard;
exports.DuchyCard       = DuchyCard;
exports.ProvinceCard    = ProvinceCard;
exports.GardensCard     = GardensCard;
exports.CurseCard       = CurseCard;
exports.AdventurerCard  = AdventurerCard;
exports.BureaucratCard  = BureaucratCard;
exports.CellarCard      = CellarCard;
exports.ChancellorCard  = ChancellorCard;
exports.ChapelCard      = ChapelCard;
exports.CouncilRoomCard = CouncilRoomCard;
exports.FeastCard       = FeastCard;
exports.FestivalCard    = FestivalCard;
exports.LaboratoryCard  = LaboratoryCard;
exports.LibraryCard     = LibraryCard;
exports.MarketCard      = MarketCard;
exports.MilitiaCard     = MilitiaCard;
exports.MineCard        = MineCard;
exports.MoatCard        = MoatCard;
exports.MoneyLenderCard = MoneyLenderCard;
exports.RemodelCard     = RemodelCard;
exports.SmithyCard      = SmithyCard;
exports.SpyCard         = SpyCard;
exports.ThiefCard       = ThiefCard;
exports.ThroneRoomCard  = ThroneRoomCard;
exports.VillageCard     = VillageCard;
exports.WitchCard       = WitchCard;
exports.WoodcutterCard  = WoodcutterCard;
exports.WorkshopCard    = WorkshopCard;