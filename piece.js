// faction = "white" || "black"
// location uses UCI standard ("e2", "c5", "f3", etc.)
class Piece {
  constructor(faction = "white", location) {
    this.faction = faction;
    this.location = location;
  }
}

class Pawn extends Piece {
  constructor(faction, location) {
    super(faction, location);
    this.code = "";
  }
}

class King extends Piece {}

class Queen extends Piece {}

class Bishop extends Piece {}

class Knight extends Piece {}
