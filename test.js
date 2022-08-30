const Chess = require("./index");

const c = new Chess(
  "rnbk2nr/ppp2Ppp/8/3q4/3b2Q1/P7/1PPP1PPP/RNB1KBNR w KQ - 1 7"
);

c.info();

c.play("fxg8=R+");

c.info();
