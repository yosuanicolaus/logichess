class Chess {
  constructor(fen, simulation = false) {
    this.fen = new Fen(fen);
    this.board = new Board(this.fen.fenBoard);
    this.pwhite = new Player("w", this);
    this.pblack = new Player("b", this);
    this.turn = this.fen.fenTurn;
    this.simulation = simulation;
    this.generateMoves();
  }

  play(move) {
    this.board.update(move);
    this.fen.update(move, this.board.board);
    this.turn = this.fen.fenTurn;
    this.generateMoves();
  }

  generateMoves() {
    if (this.turn === "w") {
      this.pwhite.generatePossibleMoves();
    } else if (this.turn === "b") {
      this.pblack.generatePossibleMoves();
    } else {
      throw "turn must be either 'w' or 'b'";
    }
  }
}

const game = new Chess();
