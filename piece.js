// faction = "w" || "b"
// location uses UCI standard ("e2", "c5", "f3", etc.)
class Piece {
  constructor(faction, rank, file) {
    if (faction !== "w" && faction !== "b") {
      throw "faction must be either 'w' or 'b'!";
    } else if (rank < 0 || rank > 7) {
      throw "piece's rank is out of bonds!";
    } else if (file < 0 || file > 7) {
      throw "piece's file is out of bonds!";
    }
    this.faction = faction;
    this.rank = rank;
    this.file = file;
  }
}

class Pawn extends Piece {
  constructor(faction, rank, file) {
    super(faction, rank, file);
    this.code = factionCode(faction, "P");
    this.value = 1;
  }
}

class King extends Piece {
  constructor(faction, rank, file) {
    super(faction, rank, file);
    this.code = factionCode(faction, "K");
    this.value = Number.POSITIVE_INFINITY;
  }
}

class Queen extends Piece {
  constructor(faction, rank, file) {
    super(faction, rank, file);
    this.code = factionCode(faction, "Q");
    this.value = 9;
  }
}

class Bishop extends Piece {
  constructor(faction, rank, file) {
    super(faction, rank, file);
    this.code = factionCode(faction, "B");
    this.value = 3;
  }
}

class Knight extends Piece {
  constructor(faction, rank, file) {
    super(faction, rank, file);
    this.code = factionCode(faction, "N");
    this.value = 3;
  }
}

class Rook extends Piece {
  constructor(faction, rank, file) {
    super(faction, rank, file);
    this.code = factionCode(faction, "R");
    this.value = 5;
  }
}

function factionCode(faction, code) {
  if (faction === "w") {
    return code.toUpperCase();
  } else if (faction === "b") {
    return code.toLowerCase();
  } else {
    throw "faction should be either 'w'/'b'!";
  }
}
