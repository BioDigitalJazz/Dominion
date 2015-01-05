function Card (id, name, cost, image) {
  this.id = id;
  this.name = name;
  this.cost = cost;
  this.image = image;
  this.types = {
    "Kingdom": false,
    "Action": false,
    "Treasure": false,
    "Victory": false,
    "Curse": false,
    "Attack": false,
    "Reaction": false
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
  this.getVictoryPoints = function() {
    return this.victoryPoints || this.countDeck();
  };
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
  
  // Special Function
  this.countDeck = function () { };
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

  if (ef["gainCard"])   { player.gainCard(ef["gainCard"]); };

  if (ef["drawCard"])   { player.drawCard(ef["drawCard"]); };
  if (ef["gainAction"]) { player.gainAction(ef["gainAction"]); };
  if (ef["gainCoin"])   { player.gainCoin(ef["gainCoin"]); };
  if (ef["gainBuy"])    { player.gainBuy(ef["gainBuy"]); };
 
  if (ef["revealCard"]) { player.revealCard(ef["revealCard"]); };
  if (ef["discard"])    { player.discard(ef["discard"]); };
  if (ef["trash"])      { player.trash(ef["trash"]); };

  if (ef["adventurer"]) { var treasures = 0;
                          while (treasures < 2) {
                            if (player.deck.length == 0) {
                              player.replenishDeck();
                            } else if (player.deck[player.deck.length -1].types["Treasure"]) {
                              player.drawCard(1);
                              treasures++;
                            } else {
                              player.discardPile.push(player.deck.pop());
                            }
                          };
                        };

  if (ef["feast"]) { player.setState("feast"); };

  if (ef["mine"]) { player.setState("mine"); };

  if (ef["moneylender"]) { player.setState("moneylender"); };

  if (ef["witch"]) { player.game.playerAttack("witch"); };
};


function AdventurerCard() {
  ActionCard.call(this, 8, 'Adventurer', 6, '/images/cards/adventurer.jpg');
  this.types.action = true;
  this.effects["adventurer"] = true;

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


function CouncilroomCard() {
  ActionCard.call(this, 13, 'CouncilRoom', 5, '/images/cards/councilroom.jpg');
  this.types.action = true;
  this.effects["drawCard"]    = 4;
  this.effects["gainBuy"]     = 1;

  // Special Function
  
};

CouncilroomCard.prototype = Object.create(ActionCard.prototype);
CouncilroomCard.prototype.constructor = CouncilroomCard;


function FeastCard() {
  ActionCard.call(this, 14, 'Feast', 4, '/images/cards/feast.jpg');
  this.types.action = true;
  this.effects["feast"] = true;

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
  this.effects["mine"] = true;

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


function MoneylenderCard() {
  ActionCard.call(this, 22, 'Moneylender', 4, '/images/cards/moneylender.jpg');
  this.types.action = true;
  this.effects["moneylender"] = true;

  // Special Function
  
};

MoneylenderCard.prototype = Object.create(ActionCard.prototype);
MoneylenderCard.prototype.constructor = MoneylenderCard;


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


function ThroneroomCard() {
  ActionCard.call(this, 27, 'Throneroom', 4, '/images/cards/throneroom.jpg');
  this.types.action = true;

  // Special Function
  
};

ThroneroomCard.prototype = Object.create(ActionCard.prototype);
ThroneroomCard.prototype.constructor = ThroneroomCard;


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
  this.effects["witch"]       = true;

  // Special Function
  
};

WitchCard.prototype = Object.create(ActionCard.prototype);
WitchCard.prototype.constructor = WitchCard;


function WoodcutterCard() {
  ActionCard.call(this, 30, 'Woodcutter', 3, '/images/cards/woodcutter.jpg');
  this.types.action = true;
  this.effects["gainBuy"]     = 1;
  this.effects["gainCoin"]    = 2;
};

WoodcutterCard.prototype = Object.create(ActionCard.prototype);
WoodcutterCard.prototype.constructor = WoodcutterCard;


function WorkshopCard() {
  ActionCard.call(this, 31, 'Workshop', 3, '/images/cards/workshop.jpg');
  this.types.action = true;

  // Special Function
  
};

WorkshopCard.prototype = Object.create(ActionCard.prototype);
WorkshopCard.prototype.constructor = WorkshopCard;


cardConstructors = {};

cardConstructors.CopperCard      = CopperCard;
cardConstructors.SilverCard      = SilverCard;
cardConstructors.GoldCard        = GoldCard;
cardConstructors.EstateCard      = EstateCard;
cardConstructors.DuchyCard       = DuchyCard;
cardConstructors.ProvinceCard    = ProvinceCard;
cardConstructors.GardensCard     = GardensCard;
cardConstructors.CurseCard       = CurseCard;
cardConstructors.AdventurerCard  = AdventurerCard;
cardConstructors.BureaucratCard  = BureaucratCard;
cardConstructors.CellarCard      = CellarCard;
cardConstructors.ChancellorCard  = ChancellorCard;
cardConstructors.ChapelCard      = ChapelCard;
cardConstructors.CouncilroomCard = CouncilroomCard;
cardConstructors.FeastCard       = FeastCard;
cardConstructors.FestivalCard    = FestivalCard;
cardConstructors.LaboratoryCard  = LaboratoryCard;
cardConstructors.LibraryCard     = LibraryCard;
cardConstructors.MarketCard      = MarketCard;
cardConstructors.MilitiaCard     = MilitiaCard;
cardConstructors.MineCard        = MineCard;
cardConstructors.MoatCard        = MoatCard;
cardConstructors.MoneylenderCard = MoneylenderCard;
cardConstructors.RemodelCard     = RemodelCard;
cardConstructors.SmithyCard      = SmithyCard;
cardConstructors.SpyCard         = SpyCard;
cardConstructors.ThiefCard       = ThiefCard;
cardConstructors.ThroneroomCard  = ThroneroomCard;
cardConstructors.VillageCard     = VillageCard;
cardConstructors.WitchCard       = WitchCard;
cardConstructors.WoodcutterCard  = WoodcutterCard;
cardConstructors.WorkshopCard    = WorkshopCard;
