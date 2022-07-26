class Chess {
  constructor(fen, simulation = false) {
    this.fen = new Fen(fen);
    this.board = new Board(this.fen.fenBoard);
    this.pwhite = new Player("w", this);
    this.pblack = new Player("b", this);
    this.turn = this.fen.fenTurn;
    this.currentPlayer = this.pwhite;
    this.simulation = simulation;
    if (!simulation) {
      this.history = new GameHistory(this);
    }

    this.updateTurn();
    this.currentPlayer.generatePossibleMoves();
  }

  play(move) {
    if (typeof move === "string") {
      move = this.currentPlayer.getMoveFromString(move);
    }
    this.board.update(move);
    this.fen.update(move, this.board.board);
    this.currentPlayer.updatePiecePosition(move);
    this.updateTurn();

    if (move.capture) {
      this.currentPlayer.removePiece(move.to.rank, move.to.file);
    }
    this.currentPlayer.generatePossibleMoves();

    if (!this.simulation) {
      this.board.display();
      this.history.update(move);
    }
  }

  info() {
    console.log(this.fen.fen);
    this.board.display();
    console.log(`${this.currentPlayer.name} to move`);
    console.log("Possible moves:");
    console.log(this.currentPlayer.getSanMoves());
  }

  // TODO: create undo() / takeback function
  // undo() {
  //   const lastFen = this.history.undo();
  // }

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
