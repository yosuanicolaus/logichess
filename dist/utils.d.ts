import Chess from "./chess";
import { Faction, PieceCode } from "./types";
export declare function inBoundaries(rank: number, file: number): boolean;
export declare function checkBoundaries(rank: number, file: number): void;
export declare function convertUciLocation(uci: string): number[];
export declare function convertRankFile(rank: number, file: number): string;
export declare function isStringNumber(str: string): boolean;
export declare function isCapital(str: string): boolean;
export declare function addIncrement(target: [number, number], increment: [number, number]): void;
export declare function allDifferent(...args: string[]): boolean;
export declare function createPieceCode(faction: Faction, code: PieceCode): PieceCode;
export declare function sameFaction(faction: Faction, panelPiece: string): boolean;
export declare function isInCheck(chess: Chess): boolean;
