"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepCopy = exports.forAllRankFile = exports.isInCheck = exports.sameFaction = exports.createPieceCode = exports.allDifferent = exports.addIncrement = exports.isCapital = exports.isStringNumber = exports.convertRankFile = exports.convertUciLocation = exports.checkBoundaries = exports.inBoundaries = void 0;
const chess_1 = require("./chess");
function inBoundaries(rank, file) {
    return rank >= 0 && rank <= 7 && file >= 0 && file <= 7;
}
exports.inBoundaries = inBoundaries;
function checkBoundaries(rank, file) {
    if (file < 0 || file > 7) {
        throw "file is out of bonds";
    }
    else if (rank < 0 || rank > 7) {
        throw "rank is out of bonds";
    }
}
exports.checkBoundaries = checkBoundaries;
function convertUciLocation(uci) {
    const fileIndex = uci[0].charCodeAt(0) - 97;
    const rankIndex = Number(uci[1]) + (4 - Number(uci[1])) * 2;
    checkBoundaries(rankIndex, fileIndex);
    return [rankIndex, fileIndex];
}
exports.convertUciLocation = convertUciLocation;
function convertRankFile(rank, file) {
    const r = (rank + (4 - rank) * 2).toString();
    const f = String.fromCharCode(97 + file);
    return f + r;
}
exports.convertRankFile = convertRankFile;
function isStringNumber(str) {
    return !isNaN(Number(str));
}
exports.isStringNumber = isStringNumber;
function isCapital(str) {
    return str.toUpperCase() === str;
}
exports.isCapital = isCapital;
function addIncrement(target, increment) {
    target[0] += increment[0];
    target[1] += increment[1];
}
exports.addIncrement = addIncrement;
function allDifferent(...args) {
    const seen = new Set();
    for (const arg of args) {
        if (seen.has(arg)) {
            return false;
        }
        seen.add(arg);
    }
    return true;
}
exports.allDifferent = allDifferent;
function createPieceCode(faction, code) {
    let pieceCode;
    if (faction === "w") {
        pieceCode = code.toUpperCase();
    }
    else {
        pieceCode = code.toLowerCase();
    }
    return pieceCode;
}
exports.createPieceCode = createPieceCode;
function sameFaction(faction, panelPiece) {
    return ((faction === "w" && isCapital(panelPiece)) ||
        (faction === "b" && !isCapital(panelPiece)));
}
exports.sameFaction = sameFaction;
function isInCheck(chess) {
    const simulation = new chess_1.Chess(chess.fen.fen, true);
    simulation.playNone();
    return simulation.currentPlayer.canCaptureKing();
}
exports.isInCheck = isInCheck;
function forAllRankFile(callback) {
    for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
            const rank = r;
            const file = f;
            callback(rank, file);
        }
    }
}
exports.forAllRankFile = forAllRankFile;
function deepCopy(array) {
    return array.map((arr) => arr.slice());
}
exports.deepCopy = deepCopy;
