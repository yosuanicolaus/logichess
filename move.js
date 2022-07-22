class Move {
  constructor(fromRank, fromFile, toRank, toFile, piece, faction) {
    this.from = {
      rank: fromRank,
      file: fromFile,
    };
    this.to = {
      rank: toRank,
      file: toFile,
    };
    this.piece = piece;
    this.faction = faction;

    this.capture;
    this.capturedPiece;
    this.check;
    this.promotion;
    this.enpassant;
    this.checkmate;
    this.castle;
  }

  getSanMove(san) {}

  getLanMove(lan) {}

  getUciMove(uci) {}
}
