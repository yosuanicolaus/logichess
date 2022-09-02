import Board from "./board";
import Fen, { FenString } from "./fen";
import Move from "./move";
import Player from "./player";
import { Faction } from "./types";
declare type GameStatus = "normal" | "check" | "end";
interface ChessData {
    status: GameStatus;
    difference: number;
    turn: Faction;
    fen: FenString;
    board: string[][];
    moves: Move[];
}
export default class Chess {
    readonly fen: Fen;
    readonly board: Board;
    readonly simulation: boolean;
    private pwhite;
    private pblack;
    protected turn: Faction;
    currentPlayer: Player;
    data?: ChessData;
    constructor(fen?: FenString, simulation?: boolean);
    play(move: Move | string): void;
    info(mode?: "log" | "get"): string | undefined;
    playNone(): void;
    private updateTurn;
    private getData;
    private getStatus;
}
export {};
