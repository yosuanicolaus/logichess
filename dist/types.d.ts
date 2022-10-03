export declare type PieceCode = "p" | "n" | "b" | "r" | "q" | "k" | "P" | "N" | "B" | "R" | "Q" | "K";
export declare type Faction = "w" | "b";
export declare type CastleCode = "K" | "Q" | "k" | "q";
declare type AtoH = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
declare type OneToEight = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export declare type Notation = `${AtoH}${OneToEight}`;
export declare type PromoteCode = "Q" | "R" | "B" | "N";
export declare type RankFile = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
declare type Array8x8<T> = [
    [
        T,
        T,
        T,
        T,
        T,
        T,
        T,
        T
    ],
    [
        T,
        T,
        T,
        T,
        T,
        T,
        T,
        T
    ],
    [
        T,
        T,
        T,
        T,
        T,
        T,
        T,
        T
    ],
    [
        T,
        T,
        T,
        T,
        T,
        T,
        T,
        T
    ],
    [
        T,
        T,
        T,
        T,
        T,
        T,
        T,
        T
    ],
    [
        T,
        T,
        T,
        T,
        T,
        T,
        T,
        T
    ],
    [
        T,
        T,
        T,
        T,
        T,
        T,
        T,
        T
    ],
    [
        T,
        T,
        T,
        T,
        T,
        T,
        T,
        T
    ]
];
export declare type BoardStringArray = Array8x8<string>;
export {};
