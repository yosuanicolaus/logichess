import Board from "../board";
import Chess from "../chess";
import Fen from "../fen";
import Move from "../move";
import { Faction, PieceCode } from "../types";
export default abstract class Piece {
    faction: Faction;
    rank: number;
    file: number;
    chessRef: Chess;
    boardRef: Board;
    fenRef: Fen;
    moves: Move[];
    code: PieceCode;
    value: number;
    constructor(faction: Faction, rank: number, file: number, chessRef: Chess, code: PieceCode, value: number);
    protected createMove(toRank: number, toFile: number): Move;
    protected addCaptureProp(move: Move): void;
    protected addMove(move: Move): void;
    protected validateMove(rank: number, file: number): void;
    protected checkSimulation(move: Move): void;
    protected canMoveOrCapture(rank: number, file: number): boolean;
    protected canMoveNormal(rank: number, file: number): boolean;
    protected canMoveCapture(rank: number, file: number): boolean;
    protected panelEmpty(rank: number, file: number): boolean;
    protected canCapture(rank: number, file: number): boolean;
    abstract generateMoves(): void;
    move(move: Move): void;
}
