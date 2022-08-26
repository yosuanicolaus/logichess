const Chess = require("./index");

const c = new Chess(
  "r1b1k1nr/pppp1ppp/2nb4/8/2B1PpPq/8/PPPPN2P/RNBQK2R w KQkq - 5 6"
);

c.info();

if (c.data.moves.find((move) => move.san === "O-O")) {
  console.log("FALSE, king should not be able to castle");
} else {
  console.log("ISSUE FIXED, king cannot castle in check");
}
