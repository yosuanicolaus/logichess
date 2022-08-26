import { Faction } from "./types";

export function convertUciLocation(uci: string) {
  const fileIndex = uci[0].charCodeAt(0) - 97;
  const rankIndex = Number(uci[1]) + (4 - Number(uci[1])) * 2;

  if (fileIndex < 0 || fileIndex > 7) {
    throw "file is out of bonds";
  } else if (rankIndex < 0 || rankIndex > 7) {
    throw "rank is out of bonds";
  }

  return [rankIndex, fileIndex];
}

export function convertRankFile(rank: number, file: number) {
  const r = (rank + (4 - rank) * 2).toString();
  const f = String.fromCharCode(97 + file);
  return f + r;
}

export function isNumber(str: any) {
  return !isNaN(str);
}

export function isCapital(str: string) {
  return str.toUpperCase() === str;
}

export function addIncrement(target: number[], increment: number[]) {
  target[0] += increment[0];
  target[1] += increment[1];
}

export function allDifferent(...args: any[]) {
  const seen = new Set();
  for (const arg of args) {
    if (seen.has(arg)) {
      return false;
    }
    seen.add(arg);
  }
  return true;
}

export function factionCode(faction: Faction, code: string) {
  if (faction === "w") {
    return code.toUpperCase();
  } else if (faction === "b") {
    return code.toLowerCase();
  }
}

export function sameFaction(faction: Faction, panelPiece: string) {
  return (
    (faction === "w" && isCapital(panelPiece)) ||
    (faction === "b" && !isCapital(panelPiece))
  );
}
