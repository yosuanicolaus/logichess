class Player {
  constructor(id = "w", gameRef) {
    this.id = id;
    this.gameRef = gameRef;
    this.pieces = [];
    this.possibleMoves = [];
    this.capturedPieces = [];

    this.getPieces();
  }

  getPieces() {
    const fen = this.gameRef.fen.fenBoard;
    let [file, rank] = [0, 0];

    for (let i = 0; i < fen.length; i++) {
      if (fen[i] === "/") {
        file = 0;
        rank++;
        continue;
      } else if (isNumber(fen[i])) {
        file += Number(fen[i]);
        continue;
      } else {
        if (this.id === "w") {
          // if white, get all capital pieces position
          if (isCapital(fen[i])) {
            this.addPiece(fen[i], rank, file);
          }
        } else if (this.id === "b") {
          // if black, get the noncapital pieces position
          if (!isCapital(fen[i])) {
            this.addPiece(fen[i], rank, file);
          }
        } else {
          throw "player's id must be either 'w' or 'b'!";
        }
        file++;
      }
    }
  }

  addPiece(code, rank, file) {
    code = code.toUpperCase();
    let newPiece;
    switch (code) {
      case "P":
        newPiece = new Pawn(this.id, rank, file, this.gameRef);
        break;
      case "N":
        newPiece = new Knight(this.id, rank, file, this.gameRef);
        break;
      case "B":
        newPiece = new Bishop(this.id, rank, file, this.gameRef);
        break;
      case "R":
        newPiece = new Rook(this.id, rank, file, this.gameRef);
        break;
      case "Q":
        newPiece = new Queen(this.id, rank, file, this.gameRef);
        break;
      case "K":
        newPiece = new King(this.id, rank, file, this.gameRef);
        break;
      default:
        throw "piece should be either p/b/n/r/q/k!";
    }
    this.pieces.push(newPiece);
  }

  removePiece(rank, file) {
    let toRemoveIndex;
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      if (piece.rank === rank && piece.file === file) {
        toRemoveIndex = i;
        break;
      }
    }
    if (isNaN(toRemoveIndex)) {
      throw "can't find piece with that rank and file!";
    }
    this.pieces.splice(toRemoveIndex, 1);
    this.gameRef.board.removePiece(rank, file);
  }

  generatePossibleMoves() {
    this.getPiecesMoves();
    this.disambiguateSan();
  }

  getPiecesMoves() {
    this.possibleMoves = [];
    for (const piece of this.pieces) {
      piece.generateMoves();
      this.possibleMoves.push(...piece.moves);
    }
  }

  disambiguateSan() {
    const seenSan = {};
    const toDisamb = {};

    for (const move of this.possibleMoves) {
      if (seenSan[move.san]) {
        if (!toDisamb[move.san]) {
          toDisamb[move.san] = [seenSan[move.san], move];
        } else {
          toDisamb[move.san].push(move);
        }
      } else {
        seenSan[move.san] = move;
      }
    }

    for (const san in toDisamb) {
      const fromFiles = [];
      const fromRanks = [];
      const moves = toDisamb[san];

      for (const move of moves) {
        fromFiles.push(move.lan[1]);
        fromRanks.push(move.lan[2]);
      }

      if (allDifferent(...fromFiles)) {
        for (const move of moves) {
          move.sanAddFromFile();
        }
      } else if (allDifferent(...fromRanks)) {
        for (const move of moves) {
          move.sanAddFromRank();
        }
      } else {
        for (const move of moves) {
          move.sanAddFromBoth();
        }
      }
    }
  }

  canCaptureKing() {
    for (const move of this.possibleMoves) {
      if (move.capture && move.capturedPiece.toUpperCase() === "K") {
        return true;
      }
    }
    return false;
  }

  getSanMoves() {
    const allSan = [];
    for (const move of this.possibleMoves) {
      allSan.push(move.san);
    }
    console.log(allSan.join(", "));
  }
}
