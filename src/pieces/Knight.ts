import Chess from "../chess";
import { Faction } from "../types";
import { factionCode } from "../utils";
import Piece from "./piece";

export class Knight extends Piece {
  constructor(faction: Faction, rank: number, file: number, chessRef: Chess) {
    const code = factionCode(faction, "N");
    const value = 3;
    super(faction, rank, file, chessRef, code, value);
  }

  generateMoves() {
    this.moves = [];

    const targets: [number, number][] = [
      [this.rank + 2, this.file + 1],
      [this.rank + 1, this.file + 2],
      [this.rank - 1, this.file + 2],
      [this.rank - 2, this.file + 1],
      [this.rank - 2, this.file - 1],
      [this.rank - 1, this.file - 2],
      [this.rank + 1, this.file - 2],
      [this.rank + 2, this.file - 1],
    ];

    for (let i = 0; i < targets.length; i++) {
      if (this.canMoveOrCapture(...targets[i])) {
        this.validateMove(...targets[i]);
      }
    }
  }
}
