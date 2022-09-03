"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Piece = void 0;
const chess_1 = require("../chess");
const move_1 = require("../move");
const utils_1 = require("../utils");
class Piece {
    constructor(faction, rank, file, chessRef, code, value) {
        (0, utils_1.checkBoundaries)(rank, file);
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
    createMove(toRank, toFile) {
        const move = new move_1.Move(this.rank, this.file, toRank, toFile, this.code, this.faction);
        return move;
    }
    addCaptureProp(move) {
        const { rank, file } = move.to;
        if (!this.panelEmpty(rank, file)) {
            move.capture = true;
            move.capturedPiece = this.boardRef.get(rank, file);
        }
    }
    addMove(move) {
        move.generate();
        this.moves.push(move);
    }
    validateMove(rank, file) {
        const move = this.createMove(rank, file);
        this.addCaptureProp(move);
        this.checkSimulation(move);
    }
    checkSimulation(move) {
        if (this.chessRef.simulation) {
            this.addMove(move);
            return;
        }
        if (move.castle && (0, utils_1.isInCheck)(this.chessRef)) {
            // king can't castle when in check
            return;
        }
        // creates simulation where we play the move
        const simulation = new chess_1.Chess(this.fenRef.fen, true);
        simulation.play(move);
        if (simulation.currentPlayer.canCaptureKing()) {
            // if the opponent can take player's king right
            // after the move, then it's illegal
            return;
        }
        if ((0, utils_1.isInCheck)(simulation)) {
            move.check = true;
        }
        move.fenResult = simulation.fen.fen;
        this.addMove(move);
    }
    canMoveOrCapture(rank, file) {
        return ((0, utils_1.inBoundaries)(rank, file) &&
            (this.panelEmpty(rank, file) || this.canCapture(rank, file)));
    }
    canMoveNormal(rank, file) {
        return (0, utils_1.inBoundaries)(rank, file) && this.panelEmpty(rank, file);
    }
    canMoveCapture(rank, file) {
        return (0, utils_1.inBoundaries)(rank, file) && this.canCapture(rank, file);
    }
    panelEmpty(rank, file) {
        const panelPiece = this.boardRef.get(rank, file);
        return panelPiece === ".";
    }
    canCapture(rank, file) {
        const panelPiece = this.boardRef.get(rank, file);
        return panelPiece !== "." && !(0, utils_1.sameFaction)(this.faction, panelPiece);
    }
    move(move) {
        this.rank = move.to.rank;
        this.file = move.to.file;
    }
}
exports.Piece = Piece;
