import Chess from "../chess";
import { Faction } from "../types";
import Piece from "./piece";
export declare class Bishop extends Piece {
    constructor(faction: Faction, rank: number, file: number, chessRef: Chess);
    generateMoves(): void;
}
