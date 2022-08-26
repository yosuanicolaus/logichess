import Board from "./board";
import Fen, { FenString } from "./fen";
import Move from "./move";
import Player from "./player";
import { Faction } from "./types";

type Data = {
  turn: string;
  fen: string;
  board: string[][];
  moves: Move[];
};

export default class Chess {
  fen: Fen;
  board: Board;
  pwhite: Player;
  pblack: Player;
  turn: Faction;
  currentPlayer: Player;
  simulation: boolean;
  data: Data;

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

    this.data = this.getData();
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

  info() {
    console.log(this.fen.fen);
    this.board.display();
    console.log(`${this.currentPlayer.name} to move`);
    console.log("Possible moves:");
    console.log(this.currentPlayer.getSanMoves());
  }

  playNone() {
    this.fen.updateTurn();
    this.fen.updateFen();
    this.updateTurn();
    this.currentPlayer.generatePossibleMoves();
  }

  updateTurn() {
    this.turn = this.fen.fenTurn;
    if (this.turn === "b") {
      this.currentPlayer = this.pblack;
    } else if (this.turn === "w") {
      this.currentPlayer = this.pwhite;
    } else {
      throw "turn must be either 'w' or 'b'";
    }
  }

  getData() {
    return {
      turn: this.turn,
      fen: this.fen.fen,
      board: this.board.board,
      moves: this.currentPlayer.possibleMoves,
    };
  }
}
