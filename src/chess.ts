import Board from "./board";
import Fen, { FenString } from "./fen";
import Move from "./move";
import Player from "./player";
import { Faction } from "./types";
import { isInCheck } from "./utils";

type GameStatus = "normal" | "check" | "end";

interface ChessData {
  status: GameStatus;
  turn: Faction;
  fen: FenString;
  board: string[][];
  moves: Move[];
}

export default class Chess {
  fen: Fen;
  board: Board;
  pwhite: Player;
  pblack: Player;
  turn: Faction;
  currentPlayer: Player;
  simulation: boolean;
  data?: ChessData;

  constructor(fen?: FenString, simulation = false) {
    this.fen = new Fen(fen);
    this.board = new Board(this.fen.fenBoard);
    this.pwhite = new Player("w", this);
    this.pblack = new Player("b", this);
    this.turn = this.fen.fenTurn;
    this.currentPlayer = this.pwhite;
    this.simulation = simulation;

    this.updateTurn();
    this.currentPlayer.generatePossibleMoves();

    if (!simulation) {
      this.data = this.getData();
    }
  }

  play(move: Move | string) {
    if (typeof move === "string") {
      move = this.currentPlayer.getMoveFromString(move);
    }
    this.board.update(move);
    this.fen.update(move, this.board.board);
    this.currentPlayer.updatePiecePosition(move);
    this.updateTurn();

    if (move.enpassant) {
      this.currentPlayer.removePiece(move.from.rank, move.to.file);
    } else if (move.capture) {
      this.currentPlayer.removePiece(move.to.rank, move.to.file);
    }
    this.currentPlayer.generatePossibleMoves();

    if (!this.simulation) {
      this.data = this.getData();
    }
  }

  info(mode: "log" | "get" = "log") {
    const info = [];
    info.push(this.fen.fen);
    info.push(this.board.display("get"));
    info.push(`status: ${this.data?.status}`);
    info.push(`${this.currentPlayer.name} to move`);
    info.push("Possible moves:");
    info.push(this.currentPlayer.getSanMoves());

    const result = info.join("\n");
    if (mode === "log") {
      console.log(result);
    } else {
      return result;
    }
  }

  playNone() {
    this.fen.updateTurn();
    this.fen.updateFen();
    this.updateTurn();
    this.currentPlayer.generatePossibleMoves();
  }

  updateTurn() {
    this.turn = this.fen.fenTurn;
    if (this.turn === "w") {
      this.currentPlayer = this.pwhite;
    } else {
      this.currentPlayer = this.pblack;
    }
  }

  getData(): ChessData {
    return {
      status: this.getStatus(),
      turn: this.turn,
      fen: this.fen.fen,
      board: this.board.board,
      moves: this.currentPlayer.possibleMoves,
    };
  }

  getStatus(): GameStatus {
    if (this.currentPlayer.possibleMoves.length === 0) {
      return "end";
    } else if (isInCheck(this)) {
      return "check";
    } else {
      return "normal";
    }
  }
}
