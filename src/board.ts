import { isStringNumber, convertUciLocation } from "./utils";
import { BoardStringArray, CastleCode, Notation } from "./types";
import { Move } from "./move";

const defaultBoard: BoardStringArray = [
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
  [".", ".", ".", ".", ".", ".", ".", "."],
];

export class Board {
  board: BoardStringArray;
  constructor(fenBoard: string) {
    this.board = Board.createBoard();
    this.load(fenBoard);
  }

  private static createBoard() {
    return defaultBoard.map((arr) => arr.slice()) as BoardStringArray;
  }

  private load(fen: string) {
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

  get(rank: number, file: number) {
    return this.board[rank][file];
  }

  /** example uci = 'e2' | 'f3' | 'h7'
      ~ get piece using uci notation */
  getByUci(uci: Notation) {
    const [rank, file] = convertUciLocation(uci);
    return this.get(rank, file);
  }

  getDisplay() {
    let display = "";
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        display += this.board[i][j] + " ";
      }
      display += "\n";
    }
    return display;
  }

  update(move: Move) {
    if (move.castle) {
      this.castle(move.castle);
    } else if (move.enpassant) {
      this.normalMove(move);
      this.removePiece(move.from.rank, move.to.file);
    } else if (move.promotion) {
      this.normalMove(move);
      this.updatePiece(move.to.rank, move.to.file, move.promotion);
    } else {
      this.normalMove(move);
    }
  }

  private normalMove(move: Move) {
    if (!move.piece) throw "move.piece should be defined";
    this.board[move.from.rank][move.from.file] = ".";
    this.board[move.to.rank][move.to.file] = move.piece;
  }

  private updatePiece(rank: number, file: number, pieceCode: string) {
    this.board[rank][file] = pieceCode;
  }

  private removePiece(rank: number, file: number) {
    this.board[rank][file] = ".";
  }

  private castle(code: CastleCode) {
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
      case "q":
        this.board[0][0] = ".";
        this.board[0][1] = ".";
        this.board[0][2] = "k";
        this.board[0][3] = "r";
        this.board[0][4] = ".";
    }
  }
}
