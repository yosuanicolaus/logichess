"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("./board");
const fen_1 = require("./fen");
const player_1 = require("./player");
const utils_1 = require("./utils");
class Chess {
    constructor(fen, simulation = false) {
        this.fen = new fen_1.default(fen);
        this.board = new board_1.default(this.fen.fenBoard);
        this.pwhite = new player_1.default("w", this);
        this.pblack = new player_1.default("b", this);
        this.turn = this.fen.fenTurn;
        this.currentPlayer = this.pwhite;
        this.simulation = simulation;
        this.updateTurn();
        this.currentPlayer.generatePossibleMoves();
        if (!simulation) {
            this.data = this.getData();
        }
    }
    play(move) {
        if (typeof move === "string") {
            move = this.currentPlayer.getMoveFromString(move);
        }
        this.board.update(move);
        this.fen.update(move, this.board.board);
        this.currentPlayer.updatePiecePosition(move);
        this.updateTurn();
        if (move.enpassant) {
            this.currentPlayer.removePiece(move.from.rank, move.to.file);
        }
        else if (move.capture) {
            this.currentPlayer.removePiece(move.to.rank, move.to.file);
        }
        this.currentPlayer.generatePossibleMoves();
        if (!this.simulation) {
            this.data = this.getData();
        }
    }
    info(mode = "log") {
        var _a;
        const info = [];
        info.push(this.fen.fen);
        info.push(this.board.display("get"));
        info.push(`status: ${(_a = this.data) === null || _a === void 0 ? void 0 : _a.status}`);
        info.push(`${this.currentPlayer.name} to move`);
        info.push("Possible moves:");
        info.push(this.currentPlayer.getSanMoves());
        const result = info.join("\n");
        if (mode === "log") {
            console.log(result);
        }
        else {
            return result;
        }
    }
    playNone() {
        this.fen.updateTurn();
        this.fen.updateFen();
        this.updateTurn();
        this.currentPlayer.generatePossibleMoves();
    }
    updateTurn() {
        this.turn = this.fen.fenTurn;
        if (this.turn === "w") {
            this.currentPlayer = this.pwhite;
        }
        else {
            this.currentPlayer = this.pblack;
        }
    }
    getData() {
        return {
            status: this.getStatus(),
            turn: this.turn,
            fen: this.fen.fen,
            board: this.board.board,
            moves: this.currentPlayer.possibleMoves,
        };
    }
    getStatus() {
        if (this.currentPlayer.possibleMoves.length === 0) {
            return "end";
        }
        else if ((0, utils_1.isInCheck)(this)) {
            return "check";
        }
        else {
            return "normal";
        }
    }
}
exports.default = Chess;
