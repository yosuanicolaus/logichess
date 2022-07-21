class Player {
  constructor(id = "w", boardRef) {
    this.id = id;
    this.ref = boardRef;
    this.pieces = [];
    this.getPieces();
  }

  getPieces() {
    const fen = this.ref.fen;
    let capital = this.id === "w";

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
            const newPiece = new Piece("w", [rank, file]);
            this.pieces.push(newPiece);
          }
        } else if (this.id === "b") {
          // if black, get the noncapital pieces position
          if (!isCapital(fen[i])) {
            const newPiece = new Piece("b", [rank, file]);
            this.pieces.push(newPiece);
          }
        } else {
          throw "player's id must be either 'w' or 'b'!";
        }
        file++;
      }
    }
  }
}
