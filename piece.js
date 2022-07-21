class Piece {
  constructor(faction, rank, file, ref) {
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
    this.ref = ref;
    this.moves = [];
    this.captures = [];
  }

  createMove(toRank, toFile) {
    const move = new Move(this.rank, this.file, toRank, toFile);
    return move;
  }

  checkMove(rank, file) {
    const move = this.createMove(rank, file);
    if (!this.panelEmpty(rank, file)) {
      move.capture = true;
    }
    // simulate if we move into (rank, file)
    // can the opponent take our king?
    // for now let's just say our king is safe
    this.moves.push(move);
  }

  panelEmpty(rank, file) {
    const panelPiece = this.ref.get(rank, file);
    return panelPiece === ".";
  }

  canCapture(rank, file) {
    const panelPiece = this.ref.get(rank, file);
    return panelPiece !== "." && !sameFaction(this.faction, panelPiece);
  }

  inBoundaries(rank, file) {
    return rank >= 0 && rank <= 7 && file >= 0 && file <= 7;
  }
}

class Pawn extends Piece {
  constructor(faction, rank, file, ref) {
    super(faction, rank, file, ref);
    this.code = factionCode(faction, "P");
    this.value = 1;
    this.startRank = rank;
    this.startFile = file;
    this.hasMoved = false;
  }

  generateMoves() {
    this.moves = [];
    let target;

    if (this.startRank !== this.rank || this.startFile !== this.file) {
      this.hasMoved = true;
    }

    if (this.faction === "w") {
      if (
        !this.hasMoved &&
        this.panelEmpty(this.rank - 2, this.file) &&
        this.panelEmpty(this.rank - 1, this.file)
      ) {
        // special first 2 panel move
        this.checkMove(this.rank - 2, this.file);
      }
      target = [this.rank - 1, this.file];
      if (this.inBoundaries(...target) && this.panelEmpty(...target)) {
        this.checkMove(...target);
      }
      target = [this.rank - 1, this.file - 1];
      if (this.inBoundaries(...target) && this.canCapture(...target)) {
        this.checkMove(...target);
      }
      target = [this.rank - 1, this.file + 1];
      if (this.inBoundaries(...target) && this.canCapture(...target)) {
        this.checkMove(...target);
      }
    } else if (this.faction === "b") {
      if (
        !this.hasMoved &&
        this.panelEmpty(this.rank + 2, this.file) &&
        this.panelEmpty(this.rank + 1, this.file)
      ) {
        // special first 2 panel move
        this.checkMove(this.rank + 2, this.file);
      }
      target = [this.rank + 1, this.file];
      if (this.inBoundaries(...target) && this.panelEmpty(...target)) {
        this.checkMove(...target);
      }
      target = [this.rank + 1, this.file - 1];
      if (this.inBoundaries(...target) && this.canCapture(...target)) {
        this.checkMove(...target);
      }
      target = [this.rank + 1, this.file + 1];
      if (this.inBoundaries(...target) && this.canCapture(...target)) {
        this.checkMove(...target);
      }
    } else {
      throw "(Pawn) faction must be either 'w' or 'b'!";
    }
  }
}

class King extends Piece {
  constructor(faction, rank, file, ref) {
    super(faction, rank, file, ref);
    this.code = factionCode(faction, "K");
    this.value = Number.POSITIVE_INFINITY;
  }
}

class Queen extends Piece {
  constructor(faction, rank, file, ref) {
    super(faction, rank, file, ref);
    this.code = factionCode(faction, "Q");
    this.value = 9;
  }
}

class Bishop extends Piece {
  constructor(faction, rank, file, ref) {
    super(faction, rank, file, ref);
    this.code = factionCode(faction, "B");
    this.value = 3;
  }
}

class Knight extends Piece {
  constructor(faction, rank, file, ref) {
    super(faction, rank, file, ref);
    this.code = factionCode(faction, "N");
    this.value = 3;
  }
}

class Rook extends Piece {
  constructor(faction, rank, file, ref) {
    super(faction, rank, file, ref);
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

// faction = "w" / "b"
// panelPiece = "\pnbrqkPNBRQK\"
function sameFaction(faction, panelPiece) {
  return (
    (faction === "w" && isCapital(panelPiece)) ||
    (faction === "b" && !isCapital(panelPiece))
  );
}
