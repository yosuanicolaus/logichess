import { Chess } from "../chess";
import { Faction } from "../types";
import { Piece } from "./piece";
export declare class Pawn extends Piece {
    constructor(faction: Faction, rank: number, file: number, chessRef: Chess);
    generateMoves(): void;
    private checkSpecialMove;
    private checkNormalMove;
    private checkCrossCapture;
    private checkEnPassant;
    private canPromote;
    private validatePromotionMove;
}
