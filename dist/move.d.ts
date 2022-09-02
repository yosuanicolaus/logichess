import { Faction, CastleCode, PromoteCode } from "./types";
export default class Move {
    #private;
    readonly from: {
        rank: number;
        file: number;
    };
    readonly to: {
        rank: number;
        file: number;
    };
    piece?: string;
    faction?: Faction;
    capture?: true;
    capturedPiece?: string;
    check?: true;
    checkmate?: true;
    promotion?: PromoteCode;
    castle?: CastleCode;
    enpassant?: true;
    san: string;
    lan: string;
    uci: string;
    fenResult: string;
    constructor(fromRank: number, fromFile: number, toRank: number, toFile: number, piece?: string, faction?: Faction);
    generate(): void;
    generateSanLan(): void;
    generateUci(): void;
    sanAddFromFile(): void;
    sanAddFromRank(): void;
    sanAddFromBoth(): void;
}
