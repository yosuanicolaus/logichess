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

  queenAndBishopMoves() {
    // check queen & bishop's moves after 1. e4 pawn moves
    const ng = new Chess(
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1"
    );
    const wq = ng.pwhite.pieces[11];
    const wb = ng.pwhite.pieces[13];
    wq.generateMoves();
    wb.generateMoves();
    console.log("queen");
    console.log(wq.moves);
    console.log("bishop");
    console.log(wb.moves);
  }
}

const test = new Test();
