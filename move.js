class Move {
  constructor(notation, notationType = "san") {
    this.piece = undefined;
    this.from = {
      file: undefined,
      rank: undefined,
    };
    this.to = {
      file: undefined,
      rank: undefined,
    };
    this.check = false;
    this.capture = false;
    this.promotion = false;
    this.enpassant = false;
    this.checkmate = false;
    this.castle = false;

    if (notationType === "san") {
      this.getSanMove(notation);
    } else if (notationType === "lan") {
      this.getLanMove(notation);
    } else if (notationType === "uci") {
      this.getUciMove(notation);
    } else {
      console.error("notationType should be 'san'/'lan'/'uci'");
    }
  }

  getSanMove(san) {}

  getLanMove(lan) {}

  getUciMove(uci) {}
}
