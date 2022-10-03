import { Chess } from "./chess";
import { Faction, PieceCode, RankFile } from "./types";

export function inBoundaries(rank: number, file: number) {
  return rank >= 0 && rank <= 7 && file >= 0 && file <= 7;
}

export function checkBoundaries(rank: number, file: number) {
  if (file < 0 || file > 7) {
    throw "file is out of bonds";
  } else if (rank < 0 || rank > 7) {
    throw "rank is out of bonds";
  }
}

export function convertUciLocation(uci: string) {
  const fileIndex = uci[0].charCodeAt(0) - 97;
  const rankIndex = Number(uci[1]) + (4 - Number(uci[1])) * 2;
  checkBoundaries(rankIndex, fileIndex);

  return [rankIndex, fileIndex];
}

export function convertRankFile(rank: number, file: number) {
  const r = (rank + (4 - rank) * 2).toString();
  const f = String.fromCharCode(97 + file);
  return f + r;
}

export function isStringNumber(str: string) {
  return !isNaN(Number(str));
}

export function isCapital(str: string) {
  return str.toUpperCase() === str;
}

export function addIncrement(
  target: [number, number],
  increment: [number, number]
) {
  target[0] += increment[0];
  target[1] += increment[1];
}

export function allDifferent(...args: string[]) {
  const seen = new Set();
  for (const arg of args) {
    if (seen.has(arg)) {
      return false;
    }
    seen.add(arg);
  }
  return true;
}

export function createPieceCode(faction: Faction, code: PieceCode): PieceCode {
  let pieceCode: PieceCode;
  if (faction === "w") {
    pieceCode = code.toUpperCase() as PieceCode;
  } else {
    pieceCode = code.toLowerCase() as PieceCode;
  }
  return pieceCode;
}

export function sameFaction(faction: Faction, panelPiece: string) {
  return (
    (faction === "w" && isCapital(panelPiece)) ||
    (faction === "b" && !isCapital(panelPiece))
  );
}

export function isInCheck(chess: Chess) {
  const simulation = new Chess(chess.fen.fen, true);
  simulation.playNone();
  return simulation.currentPlayer.canCaptureKing();
}

export function forAllRankFile(
  callback: (rank: RankFile, file: RankFile) => void
) {
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const rank = r as RankFile;
      const file = f as RankFile;
      callback(rank, file);
    }
  }
}

export function deepCopy(array: any[][]) {
  return array.map((arr) => arr.slice());
}
