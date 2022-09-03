import { Notation } from "./types";
import { Move } from "./move";
export declare class Board {
    board: string[][];
    constructor(fenBoard: string);
    private static createBoard;
    private load;
    get(rank: number, file: number): string;
    /** example uci = 'e2' | 'f3' | 'h7'
        ~ get piece using uci notation */
    getByUci(uci: Notation): string;
    getDisplay(): string;
    update(move: Move): void;
    private normalMove;
    private updatePiece;
    private removePiece;
    private castle;
}
