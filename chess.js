class Chess {
  constructor(fen) {
    this.fen = new Fen(fen);
    this.board = new Board(this.fen.fenBoard);
    this.pwhite = new Player("w", this.board);
    this.pblack = new Player("b", this.board);
  }
}

const game = new Chess();
