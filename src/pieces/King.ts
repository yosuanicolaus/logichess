import { Chess } from "../chess";
import { CastleCode, Faction } from "../types";
import { createPieceCode } from "../utils";
import { Piece } from "./piece";

export class King extends Piece {
  constructor(faction: Faction, rank: number, file: number, chessRef: Chess) {
    const code = createPieceCode(faction, "K");
    const value = Number.POSITIVE_INFINITY;
    super(faction, rank, file, chessRef, code, value);
  }

  generateMoves() {
    this.generateNormalMove();
    this.generateCastleMove();
  }

  private generateNormalMove() {
    this.moves = [];

    const targets: [number, number][] = [
      [this.rank - 1, this.file - 1],
      [this.rank - 1, this.file + 0],
      [this.rank - 1, this.file + 1],
      [this.rank + 0, this.file - 1],
      [this.rank + 0, this.file + 1],
      [this.rank + 1, this.file - 1],
      [this.rank + 1, this.file + 0],
      [this.rank + 1, this.file + 1],
    ];

    for (let i = 0; i < targets.length; i++) {
      if (this.canMoveOrCapture(...targets[i])) {
        this.validateMove(...targets[i]);
      }
    }
  }

  private generateCastleMove() {
    const castleFen = this.chessRef.fen.fenCastle;

    if (this.faction === "w") {
      if (castleFen.includes("K")) {
        this.validateCastleMove("K");
      }
      if (castleFen.includes("Q")) {
        this.validateCastleMove("Q");
      }
    } else {
      if (castleFen.includes("k")) {
        this.validateCastleMove("k");
      }
      if (castleFen.includes("q")) {
        this.validateCastleMove("q");
      }
    }
  }

  private validateCastleMove(code: CastleCode) {
    let adjacent1 = false;
    let adjacent2 = false;
    let adjacent3 = false;
    switch (code) {
      case "K":
        adjacent1 = this.panelEmpty(7, 5);
        adjacent2 = this.panelEmpty(7, 6);
        adjacent3 = true;
        break;
      case "Q":
        adjacent1 = this.panelEmpty(7, 3);
        adjacent2 = this.panelEmpty(7, 2);
        adjacent3 = this.panelEmpty(7, 1);
        break;
      case "k":
        adjacent1 = this.panelEmpty(0, 5);
        adjacent2 = this.panelEmpty(0, 6);
        adjacent3 = true;
        break;
      case "q":
        adjacent1 = this.panelEmpty(0, 3);
        adjacent2 = this.panelEmpty(0, 2);
        adjacent3 = this.panelEmpty(0, 1);
    }

    if (adjacent1 && adjacent2 && adjacent3) {
      let move;
      if (code.toUpperCase() === "K") {
        move = this.createMove(this.rank, 6);
      } else {
        move = this.createMove(this.rank, 2);
      }
      move.castle = code;
      this.checkSimulation(move);
    }
  }
}
