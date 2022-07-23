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

    this.san = "";
    this.lan = "";
    this.uci = "";
    this.generateSanLan();
    this.generateUci();
  }

  generateSanLan() {
    let lan = "";
    let san = "";
    let piece = this.piece.toUpperCase();
    if (piece !== "P") {
      lan += piece;
      san += piece;
    }
    const from = convertRankFile(this.from.rank, this.from.file);
    lan += from;
    if (this.capture) {
      lan += "x";
      san += "x";
    }
    const to = convertRankFile(this.to.rank, this.to.file);
    lan += to;
    san += to;
    if (this.checkmate) {
      lan += "#";
      san += "#";
    } else if (this.check) {
      lan += "+";
      san += "+";
    }
    this.lan = lan;
    this.san = san;
  }

  generateUci() {
    let uci = "";
    uci += convertRankFile(this.from.rank, this.from.file);
    uci += "-";
    uci += convertRankFile(this.to.rank, this.to.file);
    this.uci = uci;
  }
}
