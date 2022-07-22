class Player {
  constructor(id = "w", boardRef, fenRef) {
    this.id = id;
    this.boardRef = boardRef;
    this.fenRef = fenRef;
    this.pieces = [];
    this.possibleMoves = [];
    this.capturedPieces = [];

    this.getPieces();
  }

  getPieces() {
    const fen = this.fenRef.fenBoard;
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
        newPiece = new Pawn(this.id, rank, file, this.boardRef, this.fenRef);
        break;
      case "N":
        newPiece = new Knight(this.id, rank, file, this.boardRef, this.fenRef);
        break;
      case "B":
        newPiece = new Bishop(this.id, rank, file, this.boardRef, this.fenRef);
        break;
      case "R":
        newPiece = new Rook(this.id, rank, file, this.boardRef, this.fenRef);
        break;
      case "Q":
        newPiece = new Queen(this.id, rank, file, this.boardRef, this.fenRef);
        break;
      case "K":
        newPiece = new King(this.id, rank, file, this.boardRef, this.fenRef);
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
    if (!toRemoveIndex) {
      throw "can't find piece with that rank and file!";
    }
    this.pieces.splice(toRemoveIndex, 1);
    this.boardRef.removePiece(rank, file);
  }

  generatePossibleMoves() {
    this.possibleMoves = [];
    for (const piece of this.pieces) {
      piece.generateMoves();
      this.possibleMoves.push(...piece.moves);
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
}
