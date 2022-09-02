import Chess from "./chess";
import Move from "./move";
import { Faction } from "./types";
export default class Player {
    private faction;
    private chessRef;
    private pieces;
    possibleMoves: Move[];
    totalValue: number;
    readonly name: "White" | "Black";
    constructor(faction: Faction, chessRef: Chess);
    private static getPieces;
    private static createPiece;
    private static getTotalValue;
    update(move: Move): void;
    initialize(lastMove?: Move): void;
    private castleMove;
    private promotionMove;
    private removePiece;
    private static getPieceIndex;
    private generatePossibleMoves;
    private static getPiecesMoves;
    private static disambiguateMoveSan;
    canCaptureKing(): boolean;
    getSanMoves(): string;
    getMoveFromString(str: string): Move;
}
