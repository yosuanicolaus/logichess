"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rook = exports.Knight = exports.Bishop = exports.Queen = exports.King = exports.Pawn = void 0;
const chess_1 = require("./chess");
const move_1 = require("./move");
const utils_1 = require("./utils");
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
        const move = new move_1.default(this.rank, this.file, toRank, toFile, this.code, this.faction);
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
        const simulation = new chess_1.default(this.fenRef.fen, true);
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
exports.default = Piece;
class Pawn extends Piece {
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
class King extends Piece {
    constructor(faction, rank, file, chessRef) {
        const code = (0, utils_1.factionCode)(faction, "K");
        const value = Number.POSITIVE_INFINITY;
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
        for (let i = 0; i < targets.length; i++) {
            if (this.canMoveOrCapture(...targets[i])) {
                this.validateMove(...targets[i]);
            }
        }
        this.castleCheck();
    }
    castleCheck() {
        const castleFen = this.chessRef.fen.fenCastle;
        let kingside = false;
        let queenside = false;
        if (this.faction === "w") {
            kingside = castleFen.includes("K");
            queenside = castleFen.includes("Q");
            if (kingside) {
                this.validateCastleMove("K");
            }
            if (queenside) {
                this.validateCastleMove("Q");
            }
        }
        else {
            kingside = castleFen.includes("k");
            queenside = castleFen.includes("q");
            if (kingside) {
                this.validateCastleMove("k");
            }
            if (queenside) {
                this.validateCastleMove("q");
            }
        }
    }
    validateCastleMove(code) {
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
            }
            else {
                move = this.createMove(this.rank, 2);
            }
            move.castle = code;
            this.checkSimulation(move);
        }
    }
}
exports.King = King;
class Queen extends Piece {
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
class Bishop extends Piece {
    constructor(faction, rank, file, chessRef) {
        const code = (0, utils_1.factionCode)(faction, "B");
        const value = 3;
        super(faction, rank, file, chessRef, code, value);
    }
    generateMoves() {
        this.moves = [];
        const targets = [
            [this.rank + 1, this.file + 1],
            [this.rank - 1, this.file + 1],
            [this.rank - 1, this.file - 1],
            [this.rank + 1, this.file - 1],
        ];
        const increments = [
            [1, 1],
            [-1, 1],
            [-1, -1],
            [1, -1],
        ];
        for (let i = 0; i < 4; i++) {
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
exports.Bishop = Bishop;
class Knight extends Piece {
    constructor(faction, rank, file, chessRef) {
        const code = (0, utils_1.factionCode)(faction, "N");
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
class Rook extends Piece {
    constructor(faction, rank, file, chessRef) {
        const code = (0, utils_1.factionCode)(faction, "R");
        const value = 5;
        super(faction, rank, file, chessRef, code, value);
    }
    generateMoves() {
        this.moves = [];
        const targets = [
            [this.rank + 1, this.file],
            [this.rank - 1, this.file],
            [this.rank, this.file + 1],
            [this.rank, this.file - 1],
        ];
        const increments = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ];
        for (let i = 0; i < 4; i++) {
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
exports.Rook = Rook;
