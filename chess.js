class Chess {
  constructor(fen, simulation = false) {
    this.fen = new Fen(fen);
    this.board = new Board(this.fen.fenBoard);
    this.pwhite = new Player("w", this);
    this.pblack = new Player("b", this);
    this.turn = this.fen.fenTurn;
    this.currentPlayer = this.pwhite;
    this.simulation = simulation;
    this.updateTurn();
    this.currentPlayer.generatePossibleMoves();
  }

  play(move) {
    this.board.update(move);
    this.fen.update(move, this.board.board);
    this.updateTurn();

    if (move.capture) {
      this.currentPlayer.removePiece(move.to.rank, move.to.file);
    }
    this.currentPlayer.generatePossibleMoves();
  }

  playNone() {
    this.fen.updateTurn();
    this.fen.updateFen();
    this.updateTurn();
    this.currentPlayer.generatePossibleMoves();
  }

  updateTurn() {
    this.turn = this.fen.fenTurn;
    if (this.turn === "b") {
      this.currentPlayer = this.pblack;
    } else if (this.turn === "w") {
      this.currentPlayer = this.pwhite;
    } else {
      throw "turn must be either 'w' or 'b'";
    }
  }
}

const game = new Chess();
