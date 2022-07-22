class Player {
  constructor(id = "w", boardRef, fenRef) {
    this.id = id;
    this.boardRef = boardRef;
    this.fenRef = fenRef;
    this.pieces = [];
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
    switch (code) {
      case "P":
        this.pieces.push(new Pawn(this.id, rank, file, this.boardRef));
        break;
      case "N":
        this.pieces.push(new Knight(this.id, rank, file, this.boardRef));
        break;
      case "B":
        this.pieces.push(new Bishop(this.id, rank, file, this.boardRef));
        break;
      case "R":
        this.pieces.push(new Rook(this.id, rank, file, this.boardRef));
        break;
      case "Q":
        this.pieces.push(new Queen(this.id, rank, file, this.boardRef));
        break;
      case "K":
        this.pieces.push(new King(this.id, rank, file, this.boardRef));
        break;
      default:
        throw "piece should be either p/b/n/r/q/k!";
    }
  }
}
