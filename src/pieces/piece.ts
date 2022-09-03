import { Board } from "../board";
import { Chess } from "../chess";
import { Fen } from "../fen";
import { Move } from "../move";
import { Faction, PieceCode } from "../types";
import {
  checkBoundaries,
  inBoundaries,
  isInCheck,
  sameFaction,
} from "../utils";

export abstract class Piece {
  faction: Faction;
  rank: number;
  file: number;
  chessRef: Chess;
  boardRef: Board;
  fenRef: Fen;
  moves: Move[];
  code: PieceCode;
  value: number;

  constructor(
    faction: Faction,
    rank: number,
    file: number,
    chessRef: Chess,
    code: PieceCode,
    value: number
  ) {
    checkBoundaries(rank, file);
    this.faction = faction;
    this.rank = rank;
    this.file = file;
    this.chessRef = chessRef;
    this.boardRef = chessRef.board;
    this.fenRef = chessRef.fen;
    this.moves = [];
    this.code = code;
    this.value = value;
  }

  protected createMove(toRank: number, toFile: number) {
    const move = new Move(
      this.rank,
      this.file,
      toRank,
      toFile,
      this.code,
      this.faction
    );
    return move;
  }

  protected addCaptureProp(move: Move) {
    const { rank, file } = move.to;
    if (!this.panelEmpty(rank, file)) {
      move.capture = true;
      move.capturedPiece = this.boardRef.get(rank, file);
    }
  }

  protected addMove(move: Move) {
    move.generate();
    this.moves.push(move);
  }

  protected validateMove(rank: number, file: number) {
    const move = this.createMove(rank, file);
    this.addCaptureProp(move);
    this.checkSimulation(move);
  }

  protected checkSimulation(move: Move) {
    if (this.chessRef.simulation) {
      this.addMove(move);
      return;
    }
    if (move.castle && isInCheck(this.chessRef)) {
      // king can't castle when in check
      return;
    }
    // creates simulation where we play the move
    const simulation = new Chess(this.fenRef.fen, true);
    simulation.play(move);
    if (simulation.currentPlayer.canCaptureKing()) {
      // if the opponent can take player's king right
      // after the move, then it's illegal
      return;
    }
    if (isInCheck(simulation)) {
      move.check = true;
    }
    move.fenResult = simulation.fen.fen;
    this.addMove(move);
  }

  protected canMoveOrCapture(rank: number, file: number) {
    return (
      inBoundaries(rank, file) &&
      (this.panelEmpty(rank, file) || this.canCapture(rank, file))
    );
  }

  protected canMoveNormal(rank: number, file: number) {
    return inBoundaries(rank, file) && this.panelEmpty(rank, file);
  }

  protected canMoveCapture(rank: number, file: number) {
    return inBoundaries(rank, file) && this.canCapture(rank, file);
  }

  protected panelEmpty(rank: number, file: number) {
    const panelPiece = this.boardRef.get(rank, file);
    return panelPiece === ".";
  }

  protected canCapture(rank: number, file: number) {
    const panelPiece = this.boardRef.get(rank, file);
    return panelPiece !== "." && !sameFaction(this.faction, panelPiece);
  }

  /* ---------------------------------- */
  /* public methods called by player.ts */

  abstract generateMoves(): void;

  move(move: Move) {
    this.rank = move.to.rank;
    this.file = move.to.file;
  }
}
