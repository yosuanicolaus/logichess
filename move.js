class Move {
  constructor(fromRank, fromFile, toRank, toFile) {
    this.from = {
      rank: fromRank,
      file: fromFile,
    };
    this.to = {
      rank: toRank,
      file: toFile,
    };
    this.piece = undefined;
    this.check = false;
    this.capture = false;
    this.promotion = false;
    this.enpassant = false;
    this.checkmate = false;
    this.castle = false;
  }

  getSanMove(san) {}

  getLanMove(lan) {}

  getUciMove(uci) {}
}
