const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

class Fen {
  constructor(fen = defaultFen) {
    this.fen = fen;

    const fens = fen.split(" ");
    this.fenBoard = fens[0];
    this.fenTurn = fens[1];
    this.fenCastle = fens[2];
    this.fenEnPassant = fens[3];
    this.fenHalfmove = Number(fens[4]);
    this.fenFullmove = Number(fens[5]);

    this.castlingRights = ["K", "Q", "k", "q"];
  }

  update(move, newBoard) {
    this.updateFenBoard(newBoard);
    this.updateTurn();
    this.updateHalfmove(move);
    // TODO: update EnPassant fen
    this.updateFenCastle(move);
    this.updateFen();
  }

  updateFen() {
    this.fen = [
      this.fenBoard,
      this.fenTurn,
      this.fenCastle,
      this.fenEnPassant,
      this.fenHalfmove,
      this.fenFullmove,
    ].join(" ");
  }

  updateFenBoard(board) {
    let emptyCount = 0;
    let newFenBoard = "";
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = board[rank][file];
        if (piece === ".") {
          emptyCount++;
        } else if (emptyCount !== 0) {
          newFenBoard += emptyCount + piece;
          emptyCount = 0;
        } else {
          newFenBoard += piece;
        }
      }
      if (emptyCount != 0) {
        newFenBoard += emptyCount;
        emptyCount = 0;
      }
      if (rank !== 7) {
        newFenBoard += "/";
      }
    }
    this.fenBoard = newFenBoard;
  }

  updateTurn() {
    if (this.fenTurn === "b") {
      this.fenFullmove++;
      this.fenTurn = "w";
    } else if (this.fenTurn === "w") {
      this.fenTurn = "b";
    }
  }

  updateHalfmove(move) {
    if (move.capture || move.piece.toUpperCase() === "P") {
      this.fenHalfmove = 0;
    } else {
      this.fenHalfmove++;
    }
  }

  updateFenCastle(move) {
    const [fromRank, fromFile] = [move.from.rank, move.from.file];
    switch (move.piece) {
      case "K":
        this.castlingRights[0] = "";
        this.castlingRights[1] = "";
        break;
      case "k":
        this.castlingRights[2] = "";
        this.castlingRights[3] = "";
        break;
      case "R":
        if (fromRank === 7 && fromFile === 0) {
          this.castlingRights[0] = "";
        } else if (fromRank === 7 && fromFile === 7) {
          this.castlingRights[1] = "";
        }
        break;
      case "r":
        if (fromRank === 0 && fromFile === 0) {
          this.castlingRights[3] = "";
        } else if (fromRank === 0 && fromFile === 7) {
          this.castlingRights[2] = "";
        }
    }
    this.fenCastle = this.castlingRights.join("");
  }
}
