class GameHistory {
  constructor(game) {
    this.game = game;
    this.fens = [game.fen.fen];
    this.moves = [];
  }

  update(move) {
    this.moves.push(move);
    this.fens.push(this.game.fen.fen);
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
}
