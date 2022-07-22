class Chess {
  constructor(fen) {
    this.fen = new Fen(fen);
    this.board = new Board(this.fen.fenBoard);
    this.pwhite = new Player("w", this.board, this.fen);
    this.pblack = new Player("b", this.board, this.fen);
    this.turn = this.fen.fenTurn;
  }

  play(move) {
    this.board.update(move);
    this.fen.update(move, this.board.board);
  }
}

const game = new Chess();
