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
}

const test = new Test();
