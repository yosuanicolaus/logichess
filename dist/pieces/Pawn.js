"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pawn = void 0;
const utils_1 = require("../utils");
const piece_1 = require("./piece");
class Pawn extends piece_1.default {
    constructor(faction, rank, file, chessRef) {
        const code = (0, utils_1.factionCode)(faction, "P");
        const value = 1;
        super(faction, rank, file, chessRef, code, value);
    }
    generateMoves() {
        this.moves = [];
        this.checkSpecialMove();
        this.checkNormalMove();
        this.checkCrossCapture();
        this.checkEnPassant();
    }
    checkSpecialMove() {
        let targets;
        if (this.faction === "w" && this.rank === 6) {
            targets = [
                [this.rank - 2, this.file],
                [this.rank - 1, this.file],
            ];
        }
        else if (this.faction === "b" && this.rank === 1) {
            targets = [
                [this.rank + 2, this.file],
                [this.rank + 1, this.file],
            ];
        }
        else
            return;
        if (this.panelEmpty(...targets[0]) && this.panelEmpty(...targets[1])) {
            this.validateMove(...targets[0]);
        }
    }
    checkNormalMove() {
        let target;
        if (this.faction === "w") {
            target = [this.rank - 1, this.file];
        }
        else {
            target = [this.rank + 1, this.file];
        }
        if ((this.faction === "w" && target[0] === 0) ||
            (this.faction === "b" && target[0] === 7)) {
            this.checkPromotion(...target);
        }
        else if (this.canMoveNormal(...target)) {
            this.validateMove(...target);
        }
    }
    checkCrossCapture() {
        let targets;
        if (this.faction === "w") {
            targets = [
                [this.rank - 1, this.file - 1],
                [this.rank - 1, this.file + 1],
            ];
        }
        else {
            targets = [
                [this.rank + 1, this.file - 1],
                [this.rank + 1, this.file + 1],
            ];
        }
        for (let i = 0; i < targets.length; i++) {
            if (this.canMoveCapture(...targets[i])) {
                if ((this.faction === "w" && targets[i][0] === 0) ||
                    (this.faction === "b" && targets[i][0] === 7)) {
                    this.checkPromotion(...targets[i]);
                }
                else {
                    this.validateMove(...targets[i]);
                }
            }
        }
    }
    checkEnPassant() {
        if (this.fenRef.fenEnPassant !== "-") {
            const [eprank, epfile] = (0, utils_1.convertUciLocation)(this.fenRef.fenEnPassant);
            const eligibleRank = (this.faction === "w" && this.rank === 3) ||
                (this.faction === "b" && this.rank === 4);
            const eligibleFile = this.file === epfile - 1 || this.file === epfile + 1;
            if (eligibleRank && eligibleFile) {
                const move = this.createMove(eprank, epfile);
                move.capture = true;
                move.capturedPiece = "p";
                move.enpassant = true;
                this.checkSimulation(move);
            }
        }
    }
    checkPromotion(rank, file) {
        const promoteOption = ["Q", "R", "B", "N"];
        for (let i = 0; i < 4; i++) {
            const move = this.createMove(rank, file);
            this.addCaptureProp(move);
            move.promotion = promoteOption[i];
            this.checkSimulation(move);
        }
    }
}
exports.Pawn = Pawn;
