import { convertRankFile } from "./utils";
import { Faction, CastleCode, PromoteCode, RankFile } from "./types";

export class Move {
  readonly from: {
    rank: RankFile;
    file: RankFile;
  };
  readonly to: {
    rank: RankFile;
    file: RankFile;
  };
  piece?: string;
  faction?: Faction;

  capture?: true;
  capturedPiece?: string;
  check?: true;
  checkmate?: true;
  promotion?: PromoteCode;
  castle?: CastleCode;
  enpassant?: true;

  san: string;
  lan: string;
  uci: string;

  fenResult: string;

  constructor(
    fromRank: RankFile,
    fromFile: RankFile,
    toRank: RankFile,
    toFile: RankFile,
    piece?: string,
    faction?: Faction
  ) {
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

    this.san = "";
    this.lan = "";
    this.uci = "";

    this.fenResult = "";
  }

  generate() {
    this.generateSanLan();
    this.generateUci();
  }

  generateSanLan() {
    if (this.castle) {
      const code = this.castle.toUpperCase();
      if (code === "K") {
        this.lan = "O-O";
        this.san = "O-O";
      } else if (code === "Q") {
        this.lan = "O-O-O";
        this.san = "O-O-O";
      } else {
        throw "(Move) this.castle should be either K/k/Q/q!";
      }
      return;
    }

    let lan = "";
    let san = "";
    let piece = this.piece?.toUpperCase();
    if (piece !== "P") {
      lan += piece;
      san += piece;
    }
    const from = convertRankFile(this.from.rank, this.from.file);
    lan += from;
    if (piece === "P" && this.capture) {
      san += from[0] + "x";
    } else if (this.capture) {
      lan += "x";
      san += "x";
    }
    const to = convertRankFile(this.to.rank, this.to.file);
    lan += to;
    san += to;
    if (this.promotion) {
      lan += `=${this.promotion}`;
      san += `=${this.promotion}`;
    }
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
    uci += convertRankFile(this.to.rank, this.to.file);
    if (this.promotion) {
      uci += this.promotion.toLowerCase();
    }
    this.uci = uci;
  }

  sanAddFromFile() {
    const from = this.#sanAddFrom();
    this.san = this.san[0] + from[0] + this.san.slice(1);
  }

  sanAddFromRank() {
    const from = this.#sanAddFrom();
    this.san = this.san[0] + from[1] + this.san.slice(1);
  }

  sanAddFromBoth() {
    this.san = this.lan;
  }

  #sanAddFrom() {
    const from = convertRankFile(this.from.rank, this.from.file);

    let piece = this.piece?.toUpperCase();
    if (piece === "P" || piece === "K") {
      throw "pawn and knight should have no disambiguation";
    }

    return from;
  }
}
