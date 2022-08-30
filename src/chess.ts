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
  readonly fen: Fen;
  readonly board: Board;
  readonly simulation: boolean;
  private pwhite: Player;
  private pblack: Player;
  protected turn: Faction;
  currentPlayer: Player;
  data?: ChessData;

  constructor(fen?: FenString, simulation = false) {
    this.fen = new Fen(fen);
    this.board = new Board(this.fen.fenBoard);
    this.simulation = simulation;
    this.pwhite = new Player("w", this);
    this.pblack = new Player("b", this);
    this.turn = this.fen.fenTurn;
    this.currentPlayer = this.pwhite;

    this.updateTurn();
    this.currentPlayer.initialize();
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
    this.currentPlayer.update(move);
    this.updateTurn();
    this.currentPlayer.initialize(move);

    if (!this.simulation) this.data = this.getData();
  }

  info(mode: "log" | "get" = "log") {
    const info = [];
    info.push(this.fen.fen);
    info.push(this.board.getDisplay());
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
    this.currentPlayer.initialize();
  }

  private updateTurn() {
    this.turn = this.fen.fenTurn;
    if (this.turn === "w") {
      this.currentPlayer = this.pwhite;
    } else {
      this.currentPlayer = this.pblack;
    }
  }

  private getData(): ChessData {
    return {
      status: this.getStatus(),
      turn: this.turn,
      fen: this.fen.fen,
      board: this.board.board,
      moves: this.currentPlayer.possibleMoves,
    };
  }

  private getStatus(): GameStatus {
    if (this.currentPlayer.possibleMoves.length === 0) {
      return "end";
    } else if (isInCheck(this)) {
      return "check";
    } else {
      return "normal";
    }
  }
}
