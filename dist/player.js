"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const move_1 = require("./move");
const Rook_1 = require("./pieces/Rook");
const Knight_1 = require("./pieces/Knight");
const Bishop_1 = require("./pieces/Bishop");
const Queen_1 = require("./pieces/Queen");
const King_1 = require("./pieces/King");
const Pawn_1 = require("./pieces/Pawn");
const utils_1 = require("./utils");
class Player {
    constructor(faction, chessRef) {
        this.pieces = [];
        this.possibleMoves = [];
        this.faction = faction;
        this.chessRef = chessRef;
        if (faction === "w") {
            this.name = "White";
        }
        else {
            this.name = "Black";
        }
        this.pieces = Player.getPieces(faction, chessRef);
        this.totalValue = Player.getTotalValue(this.pieces);
    }
    static getPieces(faction, chessRef) {
        const fen = chessRef.fen.fenBoard;
        let [file, rank] = [0, 0];
        const pieces = [];
        for (let i = 0; i < fen.length; i++) {
            if (fen[i] === "/") {
                file = 0;
                rank++;
                continue;
            }
            else if ((0, utils_1.isStringNumber)(fen[i])) {
                file += Number(fen[i]);
                continue;
            }
            if (faction === "w" && (0, utils_1.isCapital)(fen[i])) {
                // white gets capital pieces position
                const piece = Player.createPiece(faction, fen[i], rank, file, chessRef);
                pieces.push(piece);
            }
            else if (faction === "b" && !(0, utils_1.isCapital)(fen[i])) {
                // black gets noncapital pieces position
                const piece = Player.createPiece(faction, fen[i], rank, file, chessRef);
                pieces.push(piece);
            }
            file++;
        }
        return pieces;
    }
    static createPiece(faction, code, rank, file, chessRef) {
        const upCode = code.toUpperCase();
        switch (upCode) {
            case "P":
                return new Pawn_1.Pawn(faction, rank, file, chessRef);
            case "N":
                return new Knight_1.Knight(faction, rank, file, chessRef);
            case "B":
                return new Bishop_1.Bishop(faction, rank, file, chessRef);
            case "R":
                return new Rook_1.Rook(faction, rank, file, chessRef);
            case "Q":
                return new Queen_1.Queen(faction, rank, file, chessRef);
            case "K":
                return new King_1.King(faction, rank, file, chessRef);
            default:
                throw "piece should be either p/b/n/r/q/k!";
        }
    }
    static getTotalValue(pieces) {
        let total = 0;
        for (const piece of pieces) {
            if (piece.code.toUpperCase() === "K")
                continue;
            total += piece.value;
        }
        return total;
    }
    update(move) {
        if (move.castle)
            return this.castleMove(move);
        if (move.promotion)
            return this.promotionMove(move);
        const { rank: fromRank, file: fromFile } = move.from;
        const pieceIdx = Player.getPieceIndex(this.pieces, fromRank, fromFile);
        this.pieces[pieceIdx].move(move);
        if (move.capture)
            this.totalValue = Player.getTotalValue(this.pieces);
    }
    initialize(lastMove) {
        const init = () => {
            this.generatePossibleMoves();
        };
        if (!lastMove)
            return init();
        if (lastMove.enpassant) {
            this.removePiece(lastMove.from.rank, lastMove.to.file);
        }
        else if (lastMove.capture) {
            this.removePiece(lastMove.to.rank, lastMove.to.file);
        }
        init();
    }
    castleMove(move) {
        if (!move.castle)
            throw "move.castle must be defined";
        const code = move.castle;
        let kingMove, rookMove;
        switch (code) {
            case "K":
                kingMove = new move_1.default(7, 4, 7, 6);
                rookMove = new move_1.default(7, 7, 7, 5);
                break;
            case "Q":
                kingMove = new move_1.default(7, 4, 7, 2);
                rookMove = new move_1.default(7, 0, 7, 3);
                break;
            case "k":
                kingMove = new move_1.default(0, 4, 0, 6);
                rookMove = new move_1.default(0, 7, 0, 5);
                break;
            case "q":
                kingMove = new move_1.default(0, 4, 0, 2);
                rookMove = new move_1.default(0, 0, 0, 3);
        }
        this.update(kingMove);
        this.update(rookMove);
    }
    promotionMove(move) {
        if (!move.promotion)
            throw "move.promotion must be defined";
        const { rank: fromRank, file: fromFile } = move.from;
        const pieceIdx = Player.getPieceIndex(this.pieces, fromRank, fromFile);
        const newPiece = Player.createPiece(this.faction, move.promotion, fromRank, fromFile, this.chessRef);
        this.pieces[pieceIdx] = newPiece;
        if (move.capture)
            this.totalValue = Player.getTotalValue(this.pieces);
    }
    removePiece(rank, file) {
        const toRemoveIndex = Player.getPieceIndex(this.pieces, rank, file);
        this.pieces.splice(toRemoveIndex, 1);
    }
    static getPieceIndex(pieces, rank, file) {
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].rank === rank && pieces[i].file === file) {
                return i;
            }
        }
        throw "can't find piece";
    }
    generatePossibleMoves() {
        const possibleMoves = Player.getPiecesMoves(this.pieces);
        Player.disambiguateMoveSan(possibleMoves);
        this.possibleMoves = possibleMoves;
    }
    static getPiecesMoves(pieces) {
        const moves = [];
        for (const piece of pieces) {
            piece.generateMoves();
            moves.push(...piece.moves);
        }
        return moves;
    }
    static disambiguateMoveSan(moves) {
        const seenSan = {};
        const toDisamb = {};
        for (const move of moves) {
            if (seenSan[move.san]) {
                if (!toDisamb[move.san]) {
                    toDisamb[move.san] = [seenSan[move.san], move];
                }
                else {
                    toDisamb[move.san].push(move);
                }
            }
            else {
                seenSan[move.san] = move;
            }
        }
        for (const san in toDisamb) {
            const fromFiles = [];
            const fromRanks = [];
            const moves = toDisamb[san];
            for (const move of moves) {
                fromFiles.push(move.lan[1]);
                fromRanks.push(move.lan[2]);
            }
            if ((0, utils_1.allDifferent)(...fromFiles)) {
                for (const move of moves) {
                    move.sanAddFromFile();
                }
            }
            else if ((0, utils_1.allDifferent)(...fromRanks)) {
                for (const move of moves) {
                    move.sanAddFromRank();
                }
            }
            else {
                for (const move of moves) {
                    move.sanAddFromBoth();
                }
            }
        }
    }
    canCaptureKing() {
        var _a;
        for (const move of this.possibleMoves) {
            if (move.capture && ((_a = move.capturedPiece) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === "K") {
                return true;
            }
        }
        return false;
    }
    getSanMoves() {
        const allSan = [];
        for (const move of this.possibleMoves) {
            allSan.push(move.san);
        }
        return allSan.join(", ");
    }
    getMoveFromString(str) {
        // check from all san, lan, and uci possible moves
        for (const move of this.possibleMoves) {
            if (move.san === str || move.lan === str || move.uci === str) {
                return move;
            }
        }
        // in case of there is check/checkmate symbol
        for (const move of this.possibleMoves) {
            if (move.san.slice(0, -1) === str || move.lan.slice(0, -1) === str) {
                console.log("found move:", move.san);
                return move;
            }
        }
        // in case the user type uci with '-' in the middle
        for (const move of this.possibleMoves) {
            let uciFrom = move.uci.slice(0, 2);
            let uciTo = move.uci.slice(-2);
            let uci = `${uciFrom}-${uciTo}`;
            if (str === uci) {
                console.log("found move:", move.uci);
                return move;
            }
        }
        throw `can't found move ${str}. Available moves: ${this.getSanMoves()}`;
    }
}
exports.default = Player;
