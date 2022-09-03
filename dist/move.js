"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Move_instances, _Move_sanAddFrom;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Move = void 0;
const utils_1 = require("./utils");
class Move {
    constructor(fromRank, fromFile, toRank, toFile, piece, faction) {
        _Move_instances.add(this);
        this.from = {
            rank: fromRank,
            file: fromFile,
        };
        this.to = {
            rank: toRank,
            file: toFile,
        };
        this.piece = piece;
        this.faction = faction;
        this.san = "";
        this.lan = "";
        this.uci = "";
        this.fenResult = "";
    }
    generate() {
        this.generateSanLan();
        this.generateUci();
    }
    generateSanLan() {
        var _a;
        if (this.castle) {
            const code = this.castle.toUpperCase();
            if (code === "K") {
                this.lan = "O-O";
                this.san = "O-O";
            }
            else if (code === "Q") {
                this.lan = "O-O-O";
                this.san = "O-O-O";
            }
            else {
                throw "(Move) this.castle should be either K/k/Q/q!";
            }
            return;
        }
        let lan = "";
        let san = "";
        let piece = (_a = this.piece) === null || _a === void 0 ? void 0 : _a.toUpperCase();
        if (piece !== "P") {
            lan += piece;
            san += piece;
        }
        const from = (0, utils_1.convertRankFile)(this.from.rank, this.from.file);
        lan += from;
        if (piece === "P" && this.capture) {
            san += from[0] + "x";
        }
        else if (this.capture) {
            lan += "x";
            san += "x";
        }
        const to = (0, utils_1.convertRankFile)(this.to.rank, this.to.file);
        lan += to;
        san += to;
        if (this.promotion) {
            lan += `=${this.promotion}`;
            san += `=${this.promotion}`;
        }
        if (this.checkmate) {
            lan += "#";
            san += "#";
        }
        else if (this.check) {
            lan += "+";
            san += "+";
        }
        this.lan = lan;
        this.san = san;
    }
    generateUci() {
        let uci = "";
        uci += (0, utils_1.convertRankFile)(this.from.rank, this.from.file);
        uci += (0, utils_1.convertRankFile)(this.to.rank, this.to.file);
        if (this.promotion) {
            uci += this.promotion.toLowerCase();
        }
        this.uci = uci;
    }
    sanAddFromFile() {
        const from = __classPrivateFieldGet(this, _Move_instances, "m", _Move_sanAddFrom).call(this);
        this.san = this.san[0] + from[0] + this.san.slice(1);
    }
    sanAddFromRank() {
        const from = __classPrivateFieldGet(this, _Move_instances, "m", _Move_sanAddFrom).call(this);
        this.san = this.san[0] + from[1] + this.san.slice(1);
    }
    sanAddFromBoth() {
        this.san = this.lan;
    }
}
exports.Move = Move;
_Move_instances = new WeakSet(), _Move_sanAddFrom = function _Move_sanAddFrom() {
    var _a;
    const from = (0, utils_1.convertRankFile)(this.from.rank, this.from.file);
    let piece = (_a = this.piece) === null || _a === void 0 ? void 0 : _a.toUpperCase();
    if (piece === "P" || piece === "K") {
        throw "pawn and knight should have no disambiguation";
    }
    return from;
};
