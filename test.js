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

  compareSan(fen) {
    const game = new Chess(fen);
    const allSan = [];
    const allLan = [];
    const allUci = [];
    for (const move of game.pwhite.possibleMoves) {
      allSan.push(move.san);
      allLan.push(move.lan);
      allUci.push(move.uci);
    }
    console.log(allSan.join(", "));
    console.log(allLan.join(", "));
    console.log(allUci.join(", "));
  }

  sanSameFile() {
    this.compareSan("k2R4/8/5R2/3q4/8/3R4/8/7K w - - 0 1");
    console.log("expected san: R8xd5, Rff3, R3xd5, Rdf3, ...");
  }

  sanSameBoth() {
    this.compareSan("8/8/3Q1Q2/8/3r1Q2/8/8/8 w - - 0 1");
    console.log("expected san: Qd6xd4, Qf6xd4, Qf4xd4");
  }

  pawnCapture() {
    const g = new Chess(
      "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1"
    );
    const white = g.currentPlayer;
    const allSan = [];
    for (const move of white.possibleMoves) {
      allSan.push(move.san);
    }
    console.log(allSan.join(", "));
    console.log(white.possibleMoves);
  }

  blackSan() {
    const game = new Chess("1k6/3N4/8/3q4/4B3/3R4/8/5K2 b - - 0 1");
    console.log(game.pblack.possibleMoves);
  }

  checkMove() {
    const game = new Chess(
      "rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1"
    );
    game.currentPlayer.getSanMoves();
  }

  checkMove2() {
    const ng = new Chess("8/8/1k6/8/8/3Q4/8/5K2 w - - 0 1");
    ng.currentPlayer.getSanMoves();
  }
}

const test = new Test();
