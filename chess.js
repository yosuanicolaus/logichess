class Chess {
  constructor(fen) {
    this.fen = new Fen(fen);
    this.board = new Board(this.fen.fenBoard);
    this.pwhite = new Player("w", this.board);
    this.pblack = new Player("b", this.board);
    this.turn = this.fen.fenTurn;
  }
}

const game = new Chess();
