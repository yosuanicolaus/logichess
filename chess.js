class Chess {
  constructor(fen) {
    this.board = new Board(fen);
    this.white = new Player("w");
    this.black = new Player("b");
  }
}

const game = new Chess();
