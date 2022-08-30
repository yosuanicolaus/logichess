export type PieceCode =
  | "p"
  | "n"
  | "b"
  | "r"
  | "q"
  | "k"
  | "P"
  | "N"
  | "B"
  | "R"
  | "Q"
  | "K";

export type Faction = "w" | "b";

export type CastleCode = "K" | "Q" | "k" | "q";

type AtoH = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
type OneToEight = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Notation = `${AtoH}${OneToEight}`;

export type PromoteCode = "Q" | "R" | "B" | "N";
