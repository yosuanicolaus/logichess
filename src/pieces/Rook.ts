import { Chess } from "../chess";
import { Faction } from "../types";
import { addIncrement, createPieceCode, inBoundaries } from "../utils";
import { Piece } from "./piece";

export class Rook extends Piece {
  constructor(faction: Faction, rank: number, file: number, chessRef: Chess) {
    const code = createPieceCode(faction, "R");
    const value = 5;
    super(faction, rank, file, chessRef, code, value);
  }

  generateMoves() {
    this.moves = [];

    const targets: [number, number][] = [
      [this.rank + 1, this.file],
      [this.rank - 1, this.file],
      [this.rank, this.file + 1],
      [this.rank, this.file - 1],
    ];
    const increments: [number, number][] = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    for (let i = 0; i < 4; i++) {
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
