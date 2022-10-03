import { Faction, CastleCode, PromoteCode, RankFile } from "./types";
export declare class Move {
    #private;
    readonly from: {
        rank: RankFile;
        file: RankFile;
    };
    readonly to: {
        rank: RankFile;
        file: RankFile;
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
    constructor(fromRank: RankFile, fromFile: RankFile, toRank: RankFile, toFile: RankFile, piece?: string, faction?: Faction);
    generate(): void;
    generateSanLan(): void;
    generateUci(): void;
    sanAddFromFile(): void;
    sanAddFromRank(): void;
    sanAddFromBoth(): void;
}
