const Chess = require("./index");
let c = new Chess();
const p = (s) => c.play(s);

p("e4");
p("e5");
p("Bc4");
p("Bc5");
p("Nf3");
p("Nf6");
p("O-O");

console.log("after white castled:");

c.info();

console.log("creating new chess using that fen");
const fenData = c.data.fen;
c = new Chess(fenData);

p("O-O");

console.log("after black castled:");

c.info();
