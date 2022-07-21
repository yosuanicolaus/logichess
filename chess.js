class Chess {
  constructor(fen) {
    this.fen = new Fen(fen);
    this.board = new Board(this.fen.fenBoard);
    this.pwhite = new Player("w");
    this.pblack = new Player("b");
  }
}

const game = new Chess();
