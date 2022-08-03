class GameHistory {
  constructor(game) {
    this.game = game;
    this.fens = [game.fen.fen];
    this.moves = [];
    this.history = {};
  }

  update(move) {
    this.moves.push(move);
    this.fens.push(this.game.fen.fen);
    this.appendHistory(move);
  }

  // TODO: undo/takeback
  undo() {
    if (this.moves.length === 0) {
      throw "you haven't made any moves yet!";
    }

    this.moves.pop();
    this.fens.pop();
    return this.fens[this.fens.length - 1];
  }

  appendHistory(move) {
    let turn = this.game.fen.fenFullmove;
    if (move.faction === "w") {
      this.history[turn] = [move.san];
    } else {
      turn--;
      this.history[turn].push(move.san);
    }
  }

  createPgn() {
    let pgn = "";
    for (const turn in this.history) {
      pgn += turn.toString() + ". ";
      pgn += this.history[turn].join(" ") + " ";
    }
    pgn = pgn.slice(0, -1);
    return pgn;
  }
}
