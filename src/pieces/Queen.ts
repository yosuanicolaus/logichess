import Chess from "../chess";
import { Faction } from "../types";
import { addIncrement, factionCode, inBoundaries } from "../utils";
import Piece from "./piece";

export class Queen extends Piece {
  constructor(faction: Faction, rank: number, file: number, chessRef: Chess) {
    const code = factionCode(faction, "Q");
    const value = 9;
    super(faction, rank, file, chessRef, code, value);
  }

  generateMoves() {
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
    const increments = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (let i = 0; i < 8; i++) {
      while (inBoundaries(...targets[i])) {
        if (this.panelEmpty(...targets[i])) {
          this.validateMove(...targets[i]);
        } else if (this.canCapture(...targets[i])) {
          this.validateMove(...targets[i]);
          break;
        } else {
          break;
        }
        addIncrement(targets[i], increments[i]);
      }
    }
  }
}
