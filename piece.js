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
  }

  createMove(toRank, toFile) {
    const move = new Move(this.rank, this.file, toRank, toFile);
    return move;
  }

  checkPanel(rank, file) {
    const panelPiece = this.ref.get(rank, file);
    let move;
    if (panelPiece === ".") {
      move = this.createMove(rank, file);
    } else {
      if (sameFaction(this.faction, panelPiece)) {
        return;
      } else {
        move = this.createMove(rank, file);
        move.capture = true;
      }
    }

    if (move) {
      // check if the opponent can take the king if we move
    }
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

    if (this.startRank !== this.rank || this.startFile !== this.file) {
      this.hasMoved = true;
    }

    if (this.faction === "w") {
      if (!this.hasMoved) {
        this.checkPanel(this.rank - 2, this.file);
      }
      this.checkPanel(this.rank - 1, this.file);
      this.checkPanel(this.rank - 1, this.file - 1);
      this.checkPanel(this.rank - 1, this.file + 1);
    } else if (this.faction === "b") {
      if (!this.hasMoved) {
        this.checkPanel(this.rank + 2, this.file);
      }
      this.checkPanel(this.rank + 1, this.file);
      this.checkPanel(this.rank + 1, this.file - 1);
      this.checkPanel(this.rank + 1, this.file + 1);
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
