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

  canMove(rank, file) {
    return (
      this.inBoundaries(rank, file) &&
      (this.panelEmpty(rank, file) || this.canCapture(rank, file))
    );
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
    this.hasMoved = false;
  }

  generateMoves() {
    this.moves = [];
    this.checkSpecialMove();
    this.checkNormalMove();
    this.checkCrossCapture();
  }

  checkSpecialMove() {
    let targets;
    if (this.faction === "w") {
      targets = [
        [this.rank - 2, this.file],
        [this.rank - 1, this.file],
      ];
    } else {
      targets = [
        [this.rank + 2, this.file],
        [this.rank + 1, this.file],
      ];
    }
    if (
      !this.hasMoved &&
      this.panelEmpty(...targets[0]) &&
      this.panelEmpty(...targets[1])
    ) {
      this.checkMove(...targets[0]);
    }
  }

  checkNormalMove() {
    let target;
    if (this.faction === "w") {
      target = [this.rank - 1, this.file];
    } else {
      target = [this.rank + 1, this.file];
    }
    if (this.inBoundaries(...target) && this.panelEmpty(...target)) {
      this.checkMove(...target);
    }
  }

  checkCrossCapture() {
    let targets;
    if (this.faction === "w") {
      targets = [
        [this.rank - 1, this.file - 1],
        [this.rank - 1, this.file + 1],
      ];
    } else {
      targets = [
        [this.rank + 1, this.file - 1],
        [this.rank + 1, this.file + 1],
      ];
    }
    for (let i = 0; i < targets.length; i++) {
      if (this.inBoundaries(...targets[i]) && this.canCapture(...targets[i])) {
        this.checkMove(...targets[i]);
      }
    }
  }

  move(move) {
    this.hasMoved = true;
    this.rank = move.to.rank;
    this.file = move.to.file;
  }
}

class King extends Piece {
  constructor(faction, rank, file, ref) {
    super(faction, rank, file, ref);
    this.code = factionCode(faction, "K");
    this.value = Number.POSITIVE_INFINITY;
    this.hasMoved = false;
  }

  generateMoves() {
    this.moves = [];

    const targets = [
      [this.rank - 1, this.file - 1],
      [this.rank - 1, this.file + 0],
      [this.rank - 1, this.file + 1],
      [this.rank + 0, this.file - 1],
      [this.rank + 0, this.file + 1],
      [this.rank + 1, this.file - 1],
      [this.rank + 1, this.file + 0],
      [this.rank + 1, this.file + 1],
    ];

    for (let i = 0; i < targets.length; i++) {
      if (this.canMove(...targets[i])) {
        this.checkMove(...targets[i]);
      }
    }
  }

  move(move) {
    this.hasMoved = true;
    this.rank = move.to.rank;
    this.file = move.to.file;
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
