class Test {
  castleQueen() {
    gp("e4");
    gp("e5");
    gp("d4");
    gp("d5");
    gp("Qg4");
    gp("Qg5");
    gp("Bf4");
    gp("Bf5");
    gp("Nc3");
    gp("Nc6");
    console.log("white's turn- should be able to play O-O-O");
    console.log("and then black's the same");
  }
}

const test = new Test();

function gp(s) {
  game.play(s);
}
