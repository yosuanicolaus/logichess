const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

class Fen {
  constructor(fen = defaultFen) {
    this.fen = fen;

    const fens = fen.split(" ");
    this.fenBoard = fens[0];
    this.fenTurn = fens[1];
    this.fenCastle = fens[2];
    this.fenEnPassant = fens[3];
    this.fenHalfmove = fens[4];
    this.fenFullmove = fens[5];
  }
}
