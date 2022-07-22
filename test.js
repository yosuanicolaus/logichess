class Test {
  captureKing1() {
    const ng = new Chess("8/3k4/8/8/3R4/8/5K2/8 w - - 0 1");
    const p = ng.pwhite;
    p.generatePossibleMoves();
    console.log(p.possibleMoves);
    console.log(p.canCaptureKing());
    console.log("expected true (can capture king)");

    console.log("---");
    const b = ng.pblack;
    b.generatePossibleMoves();
    console.log(b.possibleMoves);
    console.log(b.canCaptureKing());
    console.log("expected false");
  }

  captureKing2() {
    const ng = new Chess("8/3k4/8/8/6n1/4R3/5K2/8 w - - 0 1");
    const p = ng.pwhite;
    p.generatePossibleMoves();
    console.log(p.possibleMoves);
    console.log(p.canCaptureKing());
    console.log("expected false");

    console.log("---");
    const b = ng.pblack;
    b.generatePossibleMoves();
    console.log(b.possibleMoves);
    console.log(b.canCaptureKing());
    console.log("expected true");
  }

  blackTurn() {
    // fen: white moved 1. e4
    const ng = new Chess(
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
    );
    console.log("white moves:");
    console.log(ng.pwhite.possibleMoves);
    console.log("black moves:");
    console.log(ng.pblack.possibleMoves);
  }

  blackInCheck() {
    const g = new Chess(
      "rnbqkbnr/ppp1pppp/8/1B1p4/4P3/8/PPPP1PPP/RNBQK1NR b KQkq - 1 2"
    );
    console.log("black possible moves:");
    console.log(g.pblack.possibleMoves);
  }
}

const test = new Test();
