import { convertRankFile } from "./utils";
import { Move } from "./move";
import { Faction } from "./types";

const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export class Fen {
  fen: string;
  fenBoard: string;
  fenTurn: Faction;
  fenCastle: string;
  fenEnPassant: string;
  fenHalfmove: number;
  fenFullmove: number;
  castlingRights: string[];

  constructor(fen = defaultFen) {
    this.fen = fen;
    const fens = fen.split(" ");
    // TODO: add type & validation like fenTurn's for
    // fenBoard, fenCastle, & fenEnPassant
    this.fenBoard = fens[0];
    this.fenTurn = validateFenTurn(fens[1]);
    this.fenCastle = fens[2];
    this.fenEnPassant = fens[3];
    this.fenHalfmove = Number(fens[4]);
    this.fenFullmove = Number(fens[5]);
    this.castlingRights = this.getCastlingRights(this.fenCastle);
  }

  getCastlingRights(fenCastle: string) {
    const res = ["", "", "", ""];
    if (fenCastle.includes("K")) res[0] = "K";
    if (fenCastle.includes("Q")) res[1] = "Q";
    if (fenCastle.includes("k")) res[2] = "k";
    if (fenCastle.includes("q")) res[3] = "q";
    return res;
  }

  update(move: Move, newBoard: string[][]) {
    this.updateFenBoard(newBoard);
    this.updateTurn();
    this.updateFenCastle(move);
    this.updateFenEnPassant(move);
    this.updateHalfmove(move);
    this.updateFen();
  }

  updateFen() {
    this.fen = `${this.fenBoard} ${this.fenTurn} ${this.fenCastle} ${this.fenEnPassant} ${this.fenHalfmove} ${this.fenFullmove}`;
  }

  updateFenBoard(board: string[][]) {
    let emptyCount = 0;
    let newFenBoard = "";
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = board[rank][file];
        if (piece === ".") {
          emptyCount++;
        } else if (emptyCount !== 0) {
          newFenBoard += emptyCount + piece;
          emptyCount = 0;
        } else {
          newFenBoard += piece;
        }
      }
      if (emptyCount != 0) {
        newFenBoard += emptyCount;
        emptyCount = 0;
      }
      if (rank !== 7) {
        newFenBoard += "/";
      }
    }
    this.fenBoard = newFenBoard;
  }

  updateTurn() {
    if (this.fenTurn === "b") {
      this.fenFullmove++;
      this.fenTurn = "w";
    } else {
      this.fenTurn = "b";
    }
  }

  updateHalfmove(move: Move) {
    if (move.capture || move.piece?.toUpperCase() === "P") {
      this.fenHalfmove = 0;
    } else {
      this.fenHalfmove++;
    }
  }

  updateFenCastle(move: Move) {
    if (this.fenCastle === "-") return;
    if (move.castle) {
      const code = move.castle;
      switch (code) {
        case "K":
        case "Q":
          this.castlingRights[0] = "";
          this.castlingRights[1] = "";
          break;
        case "k":
        case "q":
          this.castlingRights[2] = "";
          this.castlingRights[3] = "";
          break;
        default:
          throw "(Fen) move.castle should be either K/Q/k/q!";
      }
    } else {
      const [fromRank, fromFile] = [move.from.rank, move.from.file];
      switch (move.piece) {
        case "K":
          this.castlingRights[0] = "";
          this.castlingRights[1] = "";
          break;
        case "k":
          this.castlingRights[2] = "";
          this.castlingRights[3] = "";
          break;
        case "R":
          if (fromRank === 7 && fromFile === 0) {
            this.castlingRights[1] = "";
          } else if (fromRank === 7 && fromFile === 7) {
            this.castlingRights[0] = "";
          }
          break;
        case "r":
          if (fromRank === 0 && fromFile === 0) {
            this.castlingRights[3] = "";
          } else if (fromRank === 0 && fromFile === 7) {
            this.castlingRights[2] = "";
          }
      }
    }
    this.fenCastle = this.castlingRights.join("");
    if (this.fenCastle === "") this.fenCastle = "-";
  }

  updateFenEnPassant(move: Move) {
    const isPawn = move.piece?.toUpperCase() === "P";
    const twoRankMove = Math.abs(move.from.rank - move.to.rank) === 2;

    if (isPawn && twoRankMove) {
      let target;
      if (move.faction === "w") {
        target = convertRankFile(move.to.rank + 1, move.to.file);
      } else {
        target = convertRankFile(move.to.rank - 1, move.to.file);
      }
      this.fenEnPassant = target;
    } else {
      this.fenEnPassant = "-";
    }
  }
}

// Fen Validation Functions

function validateFenTurn(fenTurn: string) {
  if (fenTurn !== "w" && fenTurn !== "b") {
    throw "Fen turn (fens[1]) must be w / b!";
  }
  return fenTurn;
}
