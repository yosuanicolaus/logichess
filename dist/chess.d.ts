import { Board } from "./board";
import { Fen } from "./fen";
import { Move } from "./move";
import { Player } from "./player";
import { Faction } from "./types";
declare type GameStatus = "normal" | "check" | "end";
interface ChessData {
    status: GameStatus;
    difference: number;
    turn: Faction;
    fen: string;
    board: string[][];
    moves: Move[];
}
export declare class Chess {
    readonly fen: Fen;
    readonly board: Board;
    readonly simulation: boolean;
    private pwhite;
    private pblack;
    protected turn: Faction;
    currentPlayer: Player;
    data: ChessData;
    constructor(fen?: string, simulation?: boolean);
    play(move: Move | string): void;
    info(mode?: "log" | "get"): string | undefined;
    playNone(): void;
    private updateTurn;
    private getData;
    private getStatus;
}
export {};
