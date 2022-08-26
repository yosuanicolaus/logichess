"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class Board {
    constructor(fenBoard) {
        this.board = this.createBoard();
        this.load(fenBoard);
    }
    createBoard() {
        const board = [];
        for (let i = 0; i < 8; i++) {
            board.push([]);
            for (let j = 0; j < 8; j++) {
                board[i].push(".");
            }
        }
        return board;
    }
    load(fen) {
        let rank = 0;
        let file = 0;
        for (let i = 0; i < fen.length; i++) {
            if (fen[i] === "/") {
                rank++;
                file = 0;
                continue;
            }
            else if ((0, utils_1.isNumber)(fen[i])) {
                file += Number(fen[i]);
                continue;
            }
            else {
                this.board[rank][file] = fen[i];
                file++;
            }
        }
    }
    /**
     *  example uci = "e2"|"f3"|"h7"
     *  get piece at uci location
     */
    getUci(uci) {
        const [rank, file] = (0, utils_1.convertUciLocation)(uci);
        return this.board[rank][file];
    }
    get(rank, file) {
        return this.board[rank][file];
    }
    display(mode = "log") {
        let result = "";
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                result += this.board[i][j] + " ";
            }
            result += "\n";
        }
        if (mode === "log") {
            console.log(result);
        }
        else {
            return result;
        }
    }
    update(move) {
        if (move.castle) {
            this.castle(move.castle);
        }
        else if (move.enpassant) {
            this.normalMove(move);
            this.removePiece(move.from.rank, move.to.file);
        }
        else {
            this.normalMove(move);
        }
    }
    normalMove(move) {
        this.board[move.from.rank][move.from.file] = ".";
        this.board[move.to.rank][move.to.file] = move.piece;
    }
    removePiece(rank, file) {
        this.board[rank][file] = ".";
    }
    castle(code) {
        switch (code) {
            case "K":
                this.board[7][4] = ".";
                this.board[7][5] = "R";
                this.board[7][6] = "K";
                this.board[7][7] = ".";
                break;
            case "Q":
                this.board[7][0] = ".";
                this.board[7][1] = ".";
                this.board[7][2] = "K";
                this.board[7][3] = "R";
                this.board[7][4] = ".";
                break;
            case "k":
                this.board[0][4] = ".";
                this.board[0][5] = "r";
                this.board[0][6] = "k";
                this.board[0][7] = ".";
                break;
            case "q":
                this.board[0][0] = ".";
                this.board[0][1] = ".";
                this.board[0][2] = "k";
                this.board[0][3] = "r";
                this.board[0][4] = ".";
                break;
            default:
                throw "(Board) castle code should be either K/Q/k/q!";
        }
    }
}
exports.default = Board;
