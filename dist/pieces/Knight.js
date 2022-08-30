"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Knight = void 0;
const utils_1 = require("../utils");
const piece_1 = require("./piece");
class Knight extends piece_1.default {
    constructor(faction, rank, file, chessRef) {
        const code = (0, utils_1.createPieceCode)(faction, "N");
        const value = 3;
        super(faction, rank, file, chessRef, code, value);
    }
    generateMoves() {
        this.moves = [];
        const targets = [
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
exports.Knight = Knight;
