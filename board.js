const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

class Board {
  constructor(fen = defaultFen) {
    this.fen = fen;
    this.board = [];
    this.createBoard();
    this.load(fen);
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
    let file = 0;
    let rank = 0;
    fen = fen.split(" ")[0];
    for (let i = 0; i < fen.length; i++) {
      if (fen[i] === "/") {
        file++;
        rank = 0;
        continue;
      } else if (!isNaN(fen[i])) {
        rank += Number(fen[i]);
        continue;
      } else {
        this.board[file][rank] = fen[i];
        rank++;
      }
    }
  }

  // uci = "e2"||"f3"||"h7"
  // get piece at uci location
  get(uci) {
    const [file, rank] = convertUciLocation(uci);
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
}
