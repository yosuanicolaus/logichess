class Board {
  constructor(fenBoard) {
    this.board = [];
    this.createBoard();
    this.load(fenBoard);
  }

  createBoard() {
    for (let i = 0; i < 8; i++) {
      this.board.push([]);
      for (let j = 0; j < 8; j++) {
        this.board[i].push(".");
      }
    }
  }

  load(fen) {
    let rank = 0;
    let file = 0;
    for (let i = 0; i < fen.length; i++) {
      if (fen[i] === "/") {
        rank++;
        file = 0;
        continue;
      } else if (isNumber(fen[i])) {
        file += Number(fen[i]);
        continue;
      } else {
        this.board[rank][file] = fen[i];
        file++;
      }
    }
  }

  // uci = "e2"||"f3"||"h7"
  // get piece at uci location
  getUci(uci) {
    const [rank, file] = convertUciLocation(uci);
    return this.board[rank][file];
  }

  get(rank, file) {
    return this.board[rank][file];
  }

  display() {
    let result = "";
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        result += this.board[i][j] + " ";
      }
      result += "\n";
    }
    console.log(result);
  }

  /**
   *
   * @param {Move} move
   */
  update(move) {
    this.board[move.from.rank][move.from.file] = ".";
    this.board[move.to.rank][move.to.file] = move.piece;
  }

  removePiece(rank, file) {
    this.board[rank][file] = ".";
  }
}
