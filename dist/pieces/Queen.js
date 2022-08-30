"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queen = void 0;
const utils_1 = require("../utils");
const piece_1 = require("./piece");
class Queen extends piece_1.default {
    constructor(faction, rank, file, chessRef) {
        const code = (0, utils_1.factionCode)(faction, "Q");
        const value = 9;
        super(faction, rank, file, chessRef, code, value);
    }
    generateMoves() {
        this.moves = [];
        const targets = [
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
            while ((0, utils_1.inBoundaries)(...targets[i])) {
                if (this.panelEmpty(...targets[i])) {
                    this.validateMove(...targets[i]);
                }
                else if (this.canCapture(...targets[i])) {
                    this.validateMove(...targets[i]);
                    break;
                }
                else {
                    break;
                }
                (0, utils_1.addIncrement)(targets[i], increments[i]);
            }
        }
    }
}
exports.Queen = Queen;
