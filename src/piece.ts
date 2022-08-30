import Board from "./board";
import Chess from "./chess";
import Fen from "./fen";
import Move from "./move";
import { CastleCode, Faction, PromoteCode } from "./types";
import {
  addIncrement,
  checkBoundaries,
  convertUciLocation,
  factionCode,
  isInCheck,
  sameFaction,
} from "./utils";

export default abstract class Piece {
  faction: Faction;
  rank: number;
  file: number;
  chessRef: Chess;
  boardRef: Board;
  fenRef: Fen;
  moves: Move[];
  code: string;
  value: number;

  constructor(
    faction: Faction,
    rank: number,
    file: number,
    chessRef: Chess,
    code: string,
    value: number
  ) {
    checkBoundaries(rank, file);
    this.faction = faction;
    this.rank = rank;
    this.file = file;
    this.chessRef = chessRef;
    this.boardRef = chessRef.board;
    this.fenRef = chessRef.fen;
    this.moves = [];
    this.code = code;
    this.value = value;
  }

  abstract generateMoves(): void;

  createMove(toRank: number, toFile: number) {
    const move = new Move(
      this.rank,
      this.file,
      toRank,
      toFile,
      this.code,
      this.faction
    );
    return move;
  }

  addMove(move: Move) {
    move.generate();
    this.moves.push(move);
  }

  validateMove(rank: number, file: number) {
    const move = this.createMove(rank, file);
    if (!this.panelEmpty(rank, file)) {
      move.capture = true;
      move.capturedPiece = this.boardRef.get(rank, file);
    }

    this.checkSimulation(move);
  }

  checkSimulation(move: Move) {
    if (this.chessRef.simulation) {
      this.addMove(move);
      return;
    }
    if (move.castle && isInCheck(this.chessRef)) {
      // king can't castle when in check
      return;
    }
    // creates simulation where we play the move
    const simulation = new Chess(this.fenRef.fen, true);
    simulation.play(move);
    if (simulation.currentPlayer.canCaptureKing()) {
      // if the opponent can take player's king right
      // after the move, then it's illegal
      return;
    }
    if (isInCheck(simulation)) {
      move.check = true;
    }
    move.fenResult = simulation.fen.fen;
    this.addMove(move);
  }

  canMove(rank: number, file: number) {
    return (
      this.inBoundaries(rank, file) &&
      (this.panelEmpty(rank, file) || this.canCapture(rank, file))
    );
  }

  panelEmpty(rank: number, file: number) {
    const panelPiece = this.boardRef.get(rank, file);
    return panelPiece === ".";
  }

  canCapture(rank: number, file: number) {
    const panelPiece = this.boardRef.get(rank, file);
    return panelPiece !== "." && !sameFaction(this.faction, panelPiece);
  }

  inBoundaries(rank: number, file: number) {
    return rank >= 0 && rank <= 7 && file >= 0 && file <= 7;
  }

  move(move: Move) {
    this.rank = move.to.rank;
    this.file = move.to.file;
  }
}

export class Pawn extends Piece {
  constructor(faction: Faction, rank: number, file: number, chessRef: Chess) {
    const code = factionCode(faction, "P");
    const value = 1;
    super(faction, rank, file, chessRef, code, value);
  }

  generateMoves() {
    this.moves = [];
    this.checkSpecialMove();
    this.checkNormalMove();
    this.checkCrossCapture();
    this.checkEnPassant();
  }

  checkSpecialMove() {
    let targets: [[number, number], [number, number]];
    if (this.faction === "w" && this.rank === 6) {
      targets = [
        [this.rank - 2, this.file],
        [this.rank - 1, this.file],
      ];
    } else if (this.faction === "b" && this.rank === 1) {
      targets = [
        [this.rank + 2, this.file],
        [this.rank + 1, this.file],
      ];
    } else return;
    if (this.panelEmpty(...targets[0]) && this.panelEmpty(...targets[1])) {
      this.validateMove(...targets[0]);
    }
  }

  checkNormalMove() {
    let target: [number, number];
    if (this.faction === "w") {
      target = [this.rank - 1, this.file];
    } else {
      target = [this.rank + 1, this.file];
    }
    if (
      (this.faction === "w" && target[0] === 0) ||
      (this.faction === "b" && target[0] === 7)
    ) {
      this.checkPromotion(...target);
    } else if (this.inBoundaries(...target) && this.panelEmpty(...target)) {
      this.validateMove(...target);
    }
  }

  checkCrossCapture() {
    let targets: [[number, number], [number, number]];
    if (this.faction === "w") {
      targets = [
        [this.rank - 1, this.file - 1],
        [this.rank - 1, this.file + 1],
      ];
    } else {
      targets = [
        [this.rank + 1, this.file - 1],
        [this.rank + 1, this.file + 1],
      ];
    }
    for (let i = 0; i < targets.length; i++) {
      if (this.inBoundaries(...targets[i]) && this.canCapture(...targets[i])) {
        if (
          (this.faction === "w" && targets[i][0] === 0) ||
          (this.faction === "b" && targets[i][0] === 7)
        ) {
          this.checkPromotion(...targets[i]);
        } else {
          this.validateMove(...targets[i]);
        }
      }
    }
  }

  checkEnPassant() {
    if (this.fenRef.fenEnPassant !== "-") {
      const [eprank, epfile] = convertUciLocation(this.fenRef.fenEnPassant);

      const eligibleRank =
        (this.faction === "w" && this.rank === 3) ||
        (this.faction === "b" && this.rank === 4);
      const eligibleFile = this.file === epfile - 1 || this.file === epfile + 1;

      if (eligibleRank && eligibleFile) {
        const move = this.createMove(eprank, epfile);
        move.capture = true;
        move.capturedPiece = "p";
        move.enpassant = true;
        this.checkSimulation(move);
      }
    }
  }

  checkPromotion(rank: number, file: number) {
    const promoteOption: PromoteCode[] = ["Q", "R", "B", "N"];
    for (let i = 0; i < 4; i++) {
      const move = this.createMove(rank, file);
      if (!this.panelEmpty(rank, file)) {
        move.capture = true;
        move.capturedPiece = this.boardRef.get(rank, file);
      }
      move.promotion = promoteOption[i];
      this.checkSimulation(move);
    }
  }
}

export class King extends Piece {
  constructor(faction: Faction, rank: number, file: number, chessRef: Chess) {
    const code = factionCode(faction, "K");
    const value = Number.POSITIVE_INFINITY;
    super(faction, rank, file, chessRef, code, value);
  }

  generateMoves() {
    this.moves = [];

    const targets: [number, number][] = [
      [this.rank - 1, this.file - 1],
      [this.rank - 1, this.file + 0],
      [this.rank - 1, this.file + 1],
      [this.rank + 0, this.file - 1],
      [this.rank + 0, this.file + 1],
      [this.rank + 1, this.file - 1],
      [this.rank + 1, this.file + 0],
      [this.rank + 1, this.file + 1],
    ];

    for (let i = 0; i < targets.length; i++) {
      if (this.canMove(...targets[i])) {
        this.validateMove(...targets[i]);
      }
    }

    this.castleCheck();
  }

  castleCheck() {
    const castleFen = this.chessRef.fen.fenCastle;
    let kingside = false;
    let queenside = false;

    if (this.faction === "w") {
      kingside = castleFen.includes("K");
      queenside = castleFen.includes("Q");
      if (kingside) {
        this.validateCastleMove("K");
      }
      if (queenside) {
        this.validateCastleMove("Q");
      }
    } else {
      kingside = castleFen.includes("k");
      queenside = castleFen.includes("q");
      if (kingside) {
        this.validateCastleMove("k");
      }
      if (queenside) {
        this.validateCastleMove("q");
      }
    }
  }

  validateCastleMove(code: CastleCode) {
    let adjacent1 = false;
    let adjacent2 = false;
    let adjacent3 = false;
    switch (code) {
      case "K":
        adjacent1 = this.panelEmpty(7, 5);
        adjacent2 = this.panelEmpty(7, 6);
        adjacent3 = true;
        break;
      case "Q":
        adjacent1 = this.panelEmpty(7, 3);
        adjacent2 = this.panelEmpty(7, 2);
        adjacent3 = this.panelEmpty(7, 1);
        break;
      case "k":
        adjacent1 = this.panelEmpty(0, 5);
        adjacent2 = this.panelEmpty(0, 6);
        adjacent3 = true;
        break;
      case "q":
        adjacent1 = this.panelEmpty(0, 3);
        adjacent2 = this.panelEmpty(0, 2);
        adjacent3 = this.panelEmpty(0, 1);
        break;
      default:
        throw "(Piece) code should be either K/Q/k/q!";
    }

    if (adjacent1 && adjacent2 && adjacent3) {
      let move;
      if (code.toUpperCase() === "K") {
        move = this.createMove(this.rank, 6);
      } else {
        move = this.createMove(this.rank, 2);
      }
      move.castle = code;
      this.checkSimulation(move);
    }
  }
}

export class Queen extends Piece {
  constructor(faction: Faction, rank: number, file: number, chessRef: Chess) {
    const code = factionCode(faction, "Q");
    const value = 9;
    super(faction, rank, file, chessRef, code, value);
  }

  generateMoves() {
    this.moves = [];

    const targets: [number, number][] = [
      [this.rank - 1, this.file - 1],
      [this.rank - 1, this.file + 0],
      [this.rank - 1, this.file + 1],
      [this.rank + 0, this.file - 1],
      [this.rank + 0, this.file + 1],
      [this.rank + 1, this.file - 1],
      [this.rank + 1, this.file + 0],
      [this.rank + 1, this.file + 1],
    ];
    const increments = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (let i = 0; i < 8; i++) {
      while (this.inBoundaries(...targets[i])) {
        if (this.panelEmpty(...targets[i])) {
          this.validateMove(...targets[i]);
        } else if (this.canCapture(...targets[i])) {
          this.validateMove(...targets[i]);
          break;
        } else {
          break;
        }
        addIncrement(targets[i], increments[i]);
      }
    }
  }
}

export class Bishop extends Piece {
  constructor(faction: Faction, rank: number, file: number, chessRef: Chess) {
    const code = factionCode(faction, "B");
    const value = 3;
    super(faction, rank, file, chessRef, code, value);
  }

  generateMoves() {
    this.moves = [];

    const targets: [number, number][] = [
      [this.rank + 1, this.file + 1],
      [this.rank - 1, this.file + 1],
      [this.rank - 1, this.file - 1],
      [this.rank + 1, this.file - 1],
    ];
    const increments = [
      [1, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
    ];

    for (let i = 0; i < 4; i++) {
      while (this.inBoundaries(...targets[i])) {
        if (this.panelEmpty(...targets[i])) {
          this.validateMove(...targets[i]);
        } else if (this.canCapture(...targets[i])) {
          this.validateMove(...targets[i]);
          break;
        } else {
          break;
        }
        addIncrement(targets[i], increments[i]);
      }
    }
  }
}

export class Knight extends Piece {
  constructor(faction: Faction, rank: number, file: number, chessRef: Chess) {
    const code = factionCode(faction, "N");
    const value = 3;
    super(faction, rank, file, chessRef, code, value);
  }

  generateMoves() {
    this.moves = [];

    const targets: [number, number][] = [
      [this.rank + 2, this.file + 1],
      [this.rank + 1, this.file + 2],
      [this.rank - 1, this.file + 2],
      [this.rank - 2, this.file + 1],
      [this.rank - 2, this.file - 1],
      [this.rank - 1, this.file - 2],
      [this.rank + 1, this.file - 2],
      [this.rank + 2, this.file - 1],
    ];

    for (let i = 0; i < targets.length; i++) {
      if (this.canMove(...targets[i])) {
        this.validateMove(...targets[i]);
      }
    }
  }
}

export class Rook extends Piece {
  constructor(faction: Faction, rank: number, file: number, chessRef: Chess) {
    const code = factionCode(faction, "R");
    const value = 5;
    super(faction, rank, file, chessRef, code, value);
  }

  generateMoves() {
    this.moves = [];

    const targets: [number, number][] = [
      [this.rank + 1, this.file],
      [this.rank - 1, this.file],
      [this.rank, this.file + 1],
      [this.rank, this.file - 1],
    ];
    const increments = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    for (let i = 0; i < 4; i++) {
      while (this.inBoundaries(...targets[i])) {
        if (this.panelEmpty(...targets[i])) {
          this.validateMove(...targets[i]);
        } else if (this.canCapture(...targets[i])) {
          this.validateMove(...targets[i]);
          break;
        } else {
          break;
        }
        addIncrement(targets[i], increments[i]);
      }
    }
  }
}
