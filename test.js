class Test {
  constructor() {
    this.g = new Chess();
  }

  pieceGenerateMoves() {
    // generate g-file knight's moves
    const wknight = this.g.pwhite.pieces[14];
    wknight.generateMoves();
    console.log(wknight.moves);
  }

  queenMoves() {
    // check queen & bishop's moves after 1. e4 pawn moves
    const ng = new Chess("8/8/1b6/8/3Q1r2/8/2n5/8 w - - 0 1");
    const wq = ng.pwhite.pieces[0];
    wq.generateMoves();
    console.log(wq.moves);

    for (const move of wq.moves) {
      if (move.capture) {
        console.log("captured: ", move.capturedPiece);
      }
    }
  }

  moveObj() {
    const p = this.g.pwhite.pieces[5];
    p.generateMoves();
    return p.moves;
  }
}

const test = new Test();
