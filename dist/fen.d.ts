import Move from "./move";
import { Faction } from "./types";
export declare type FenString = `${string} ${Faction} ${string} ${string} ${number} ${number}`;
export default class Fen {
    fen: FenString;
    fenBoard: string;
    fenTurn: Faction;
    fenCastle: string;
    fenEnPassant: string;
    fenHalfmove: number;
    fenFullmove: number;
    castlingRights: string[];
    constructor(fen?: `${string} b ${string} ${string} ${number} ${number}` | `${string} w ${string} ${string} ${number} ${number}`);
    getCastlingRights(fenCastle: string): string[];
    update(move: Move, newBoard: string[][]): void;
    updateFen(): void;
    updateFenBoard(board: string[][]): void;
    updateTurn(): void;
    updateHalfmove(move: Move): void;
    updateFenCastle(move: Move): void;
    updateFenEnPassant(move: Move): void;
}
