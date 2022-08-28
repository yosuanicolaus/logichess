import { isStringNumber, convertUciLocation } from "./utils";
import { CastleCode, Notation } from "./types";
import Move from "./move";

export default class Board {
  board: string[][];
  constructor(fenBoard: string) {
    this.board = this.createBoard();
    this.load(fenBoard);
  }

  createBoard() {
    const board: string[][] = [];
    for (let i = 0; i < 8; i++) {
      board.push([]);
      for (let j = 0; j < 8; j++) {
        board[i].push(".");
      }
    }
    return board;
  }

  load(fen: string) {
    let rank = 0;
    let file = 0;
    for (let i = 0; i < fen.length; i++) {
      if (fen[i] === "/") {
        rank++;
        file = 0;
        continue;
      } else if (isStringNumber(fen[i])) {
        file += Number(fen[i]);
        continue;
      } else {
        this.board[rank][file] = fen[i];
        file++;
      }
    }
  }

  /**
   *  example uci = "e2"|"f3"|"h7"
   *  get piece at uci location
   */
  getUci(uci: Notation) {
    const [rank, file] = convertUciLocation(uci);
    return this.board[rank][file];
  }

  get(rank: number, file: number) {
    return this.board[rank][file];
  }

  display(mode: "log" | "get" = "log") {
    let result = "";
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        result += this.board[i][j] + " ";
      }
      result += "\n";
    }
    if (mode === "log") {
      console.log(result);
    } else {
      return result;
    }
  }

  update(move: Move) {
    if (move.castle) {
      this.castle(move.castle);
    } else if (move.enpassant) {
      this.normalMove(move);
      this.removePiece(move.from.rank, move.to.file);
    } else {
      this.normalMove(move);
    }
  }

  normalMove(move: Move) {
    if (!move.piece) throw "move.piece should be defined";
    this.board[move.from.rank][move.from.file] = ".";
    this.board[move.to.rank][move.to.file] = move.piece;
  }

  removePiece(rank: number, file: number) {
    this.board[rank][file] = ".";
  }

  castle(code: CastleCode) {
    switch (code) {
      case "K":
        this.board[7][4] = ".";
        this.board[7][5] = "R";
        this.board[7][6] = "K";
        this.board[7][7] = ".";
        break;
      case "Q":
        this.board[7][0] = ".";
        this.board[7][1] = ".";
        this.board[7][2] = "K";
        this.board[7][3] = "R";
        this.board[7][4] = ".";
        break;
      case "k":
        this.board[0][4] = ".";
        this.board[0][5] = "r";
        this.board[0][6] = "k";
        this.board[0][7] = ".";
        break;
      default:
        this.board[0][0] = ".";
        this.board[0][1] = ".";
        this.board[0][2] = "k";
        this.board[0][3] = "r";
        this.board[0][4] = ".";
    }
  }
}
