import { Move } from "./move";
import { Faction } from "./types";
export declare class Fen {
    fen: string;
    fenBoard: string;
    fenTurn: Faction;
    fenCastle: string;
    fenEnPassant: string;
    fenHalfmove: number;
    fenFullmove: number;
    castlingRights: string[];
    constructor(fen?: string);
    getCastlingRights(fenCastle: string): string[];
    update(move: Move, newBoard: string[][]): void;
    updateFen(): void;
    updateFenBoard(board: string[][]): void;
    updateTurn(): void;
    updateHalfmove(move: Move): void;
    updateFenCastle(move: Move): void;
    updateFenEnPassant(move: Move): void;
}
