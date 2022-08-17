function convertUciLocation(uci) {
    const fileIndex = uci[0].charCodeAt() - 97;
    const rankIndex = Number(uci[1]) + (4 - Number(uci[1])) * 2;
    if (fileIndex < 0 || fileIndex > 7) {
        throw "file is out of bonds";
    } else if (rankIndex < 0 || rankIndex > 7) {
        throw "rank is out of bonds";
    }
    return [rankIndex, fileIndex];
}

function convertRankFile(rank, file) {
    const r = (rank + (4 - rank) * 2).toString();
    const f = String.fromCharCode(97 + file);
    return f + r;
}

function isNumber(str) {
    return !isNaN(str);
}

function isCapital(str) {
    return str.toUpperCase() === str;
}

function addIncrement(target, increment) {
    target[0] += increment[0];
    target[1] += increment[1];
}

function allDifferent(...args) {
    const seen = new Set();
    for (const arg of args) {
        if (seen.has(arg)) {
            return false;
        }
        seen.add(arg);
    }
    return true;
}

function factionCode(faction, code) {
    if (faction === "w") {
        return code.toUpperCase();
    } else if (faction === "b") {
        return code.toLowerCase();
    } else {
        throw "faction should be either 'w'/'b'!";
    }
}
// faction = "w" / "b"
// panelPiece = "\pnbrqkPNBRQK\"
function sameFaction(faction, panelPiece) {
    return (
        (faction === "w" && isCapital(panelPiece)) || (faction === "b" && !isCapital(panelPiece)));
}
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
        this.updateFenCastle(move);
        this.updateFenEnPassant(move);
        this.updateHalfmove(move);
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
        if (move.castle) {
            const code = move.castle;
            switch (code) {
                case "K":
                case "Q":
                    this.castlingRights[0] = "";
                    this.castlingRights[1] = "";
                    break;
                case "k":
                case "q":
                    this.castlingRights[2] = "";
                    this.castlingRights[3] = "";
                    break;
                default:
                    throw "(Fen) move.castle should be either K/Q/k/q!";
            }
        } else {
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
        }
        this.fenCastle = this.castlingRights.join("");
    }
    updateFenEnPassant(move) {
        const isPawn = move.piece.toUpperCase() === "P";
        const twoRankMove = Math.abs(move.from.rank - move.to.rank) === 2;
        if (isPawn && twoRankMove) {
            let target;
            if (move.faction === "w") {
                target = convertRankFile(move.to.rank + 1, move.to.file);
            } else {
                target = convertRankFile(move.to.rank - 1, move.to.file);
            }
            this.fenEnPassant = target;
        } else {
            this.fenEnPassant = "-";
        }
    }
}
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
    update(move) {
        if (move.castle) {
            this.castle(move.castle);
        } else if (move.enpassant) {
            this.normalMove(move);
            this.removePiece(move.from.rank, move.to.file);
        } else {
            this.normalMove(move);
        }
    }
    normalMove(move) {
        this.board[move.from.rank][move.from.file] = ".";
        this.board[move.to.rank][move.to.file] = move.piece;
    }
    removePiece(rank, file) {
        this.board[rank][file] = ".";
    }
    // code == "K"/"Q"/"k"/"q";
    castle(code) {
        switch (code) {
            case "K":
                this.board[7][4] = ".";
                this.board[7][5] = "R";
                this.board[7][6] = "K";
                this.board[7][7] = ".";
                break;
            case "Q":
                this.board[7][0] = ".";
                this.board[7][1] = ".";
                this.board[7][2] = "K";
                this.board[7][3] = "R";
                this.board[7][4] = ".";
                break;
            case "k":
                this.board[0][4] = ".";
                this.board[0][5] = "r";
                this.board[0][6] = "k";
                this.board[0][7] = ".";
                break;
            case "q":
                this.board[0][0] = ".";
                this.board[0][1] = ".";
                this.board[0][2] = "k";
                this.board[0][3] = "r";
                this.board[0][4] = ".";
                break;
            default:
                throw "(Board) castle code should be either K/Q/k/q!";
        }
    }
}
class Player {
    constructor(id = "w", gameRef) {
        this.id = id;
        this.gameRef = gameRef;
        this.pieces = [];
        this.possibleMoves = [];
        this.capturedPieces = [];
        if (id === "w") {
            this.name = "White";
        } else if (id === "b") {
            this.name = "Black";
        }
        this.getPieces();
    }
    getPieces() {
        const fen = this.gameRef.fen.fenBoard;
        let [file, rank] = [0, 0];
        for (let i = 0; i < fen.length; i++) {
            if (fen[i] === "/") {
                file = 0;
                rank++;
                continue;
            } else if (isNumber(fen[i])) {
                file += Number(fen[i]);
                continue;
            } else {
                if (this.id === "w") {
                    // if white, get all capital pieces position
                    if (isCapital(fen[i])) {
                        this.addPiece(fen[i], rank, file);
                    }
                } else if (this.id === "b") {
                    // if black, get the noncapital pieces position
                    if (!isCapital(fen[i])) {
                        this.addPiece(fen[i], rank, file);
                    }
                } else {
                    throw "player's id must be either 'w' or 'b'!";
                }
                file++;
            }
        }
    }
    addPiece(code, rank, file) {
        code = code.toUpperCase();
        let newPiece;
        switch (code) {
            case "P":
                newPiece = new Pawn(this.id, rank, file, this.gameRef);
                break;
            case "N":
                newPiece = new Knight(this.id, rank, file, this.gameRef);
                break;
            case "B":
                newPiece = new Bishop(this.id, rank, file, this.gameRef);
                break;
            case "R":
                newPiece = new Rook(this.id, rank, file, this.gameRef);
                break;
            case "Q":
                newPiece = new Queen(this.id, rank, file, this.gameRef);
                break;
            case "K":
                newPiece = new King(this.id, rank, file, this.gameRef);
                break;
            default:
                throw "piece should be either p/b/n/r/q/k!";
        }
        this.pieces.push(newPiece);
    }
    updatePiecePosition(move) {
        if (move.castle) {
            this.castle(move.castle);
            return;
        }
        const [fr, ff] = [move.from.rank, move.from.file];
        for (const piece of this.pieces) {
            if (piece.rank === fr && piece.file === ff) {
                piece.move(move);
                return;
            }
        }
        throw "can't find piece from that rank and file";
    }
    // code == K/Q/k/q
    castle(code) {
        let kingMove, rookMove;
        switch (code) {
            case "K":
                kingMove = new Move(7, 4, 7, 6);
                rookMove = new Move(7, 7, 7, 5);
                break;
            case "Q":
                kingMove = new Move(7, 4, 7, 2);
                rookMove = new Move(7, 0, 7, 3);
                break;
            case "k":
                kingMove = new Move(0, 4, 0, 6);
                rookMove = new Move(0, 7, 0, 5);
                break;
            case "q":
                kingMove = new Move(0, 4, 0, 2);
                rookMove = new Move(0, 0, 0, 3);
                break;
            default:
                throw "(Player) castle code should be either K/Q/k/q!";
        }
        this.updatePiecePosition(kingMove);
        this.updatePiecePosition(rookMove);
    }
    removePiece(rank, file) {
        let toRemoveIndex;
        for (let i = 0; i < this.pieces.length; i++) {
            const piece = this.pieces[i];
            if (piece.rank === rank && piece.file === file) {
                toRemoveIndex = i;
                break;
            }
        }
        if (isNaN(toRemoveIndex)) {
            throw "can't find piece with that rank and file!";
        }
        this.pieces.splice(toRemoveIndex, 1);
    }
    generatePossibleMoves() {
        this.getPiecesMoves();
        this.disambiguateSan();
    }
    getPiecesMoves() {
        this.possibleMoves = [];
        for (const piece of this.pieces) {
            piece.generateMoves();
            this.possibleMoves.push(...piece.moves);
        }
    }
    disambiguateSan() {
        const seenSan = {};
        const toDisamb = {};
        for (const move of this.possibleMoves) {
            if (seenSan[move.san]) {
                if (!toDisamb[move.san]) {
                    toDisamb[move.san] = [seenSan[move.san], move];
                } else {
                    toDisamb[move.san].push(move);
                }
            } else {
                seenSan[move.san] = move;
            }
        }
        for (const san in toDisamb) {
            const fromFiles = [];
            const fromRanks = [];
            const moves = toDisamb[san];
            for (const move of moves) {
                fromFiles.push(move.lan[1]);
                fromRanks.push(move.lan[2]);
            }
            if (allDifferent(...fromFiles)) {
                for (const move of moves) {
                    move.sanAddFromFile();
                }
            } else if (allDifferent(...fromRanks)) {
                for (const move of moves) {
                    move.sanAddFromRank();
                }
            } else {
                for (const move of moves) {
                    move.sanAddFromBoth();
                }
            }
        }
    }
    canCaptureKing() {
        for (const move of this.possibleMoves) {
            if (move.capture && move.capturedPiece.toUpperCase() === "K") {
                return true;
            }
        }
        return false;
    }
    getSanMoves() {
        const allSan = [];
        for (const move of this.possibleMoves) {
            allSan.push(move.san);
        }
        return allSan.join(", ");
    }
    getMoveFromString(str) {
        // check from all san, lan, and uci possible moves
        for (const move of this.possibleMoves) {
            if (move.san === str || move.lan === str || move.uci === str) {
                return move;
            }
        }
        // in case of there is check/checkmate symbol
        for (const move of this.possibleMoves) {
            if (move.san.slice(0, -1) === str || move.lan.slice(0, -1) === str) {
                console.log("found move:", move.san);
                return move;
            }
        }
        // in case the user type uci with '-' in the middle
        for (const move of this.possibleMoves) {
            let uciFrom = move.uci.slice(0, 2);
            let uciTo = move.uci.slice(-2);
            let uci = `${uciFrom}-${uciTo}`;
            if (str === uci) {
                console.log("found move:", move.uci);
                return move;
            }
        }
        throw `can't found move ${str}. Available moves: ${this.getSanMoves()}`;
    }
}
class Piece {
    constructor(faction, rank, file, gameRef) {
        if (faction !== "w" && faction !== "b") {
            throw "faction must be either 'w' or 'b'!";
        } else if (rank < 0 || rank > 7) {
            throw "piece's rank is out of bonds!";
        } else if (file < 0 || file > 7) {
            throw "piece's file is out of bonds!";
        }
        this.faction = faction;
        this.rank = rank;
        this.file = file;
        this.gameRef = gameRef;
        this.boardRef = gameRef.board;
        this.fenRef = gameRef.fen;
        this.moves = [];
        this.captures = [];
        this.hasMoved = false;
        this.code;
    }
    createMove(toRank, toFile) {
        const move = new Move(this.rank, this.file, toRank, toFile, this.code, this.faction);
        return move;
    }
    addMove(move) {
        move.generate();
        this.moves.push(move);
    }
    validateMove(rank, file) {
        const move = this.createMove(rank, file);
        if (!this.panelEmpty(rank, file)) {
            move.capture = true;
            move.capturedPiece = this.boardRef.get(rank, file);
        }
        this.checkSimulation(move);
    }
    checkSimulation(move) {
        if (this.gameRef.simulation) {
            this.addMove(move);
            return;
        }
        // simulate if we move into (rank, file)
        // can the opponent take our king?
        const simulation = new Chess(this.fenRef.fen, true);
        simulation.play(move);
        if (simulation.currentPlayer.canCaptureKing()) {
            // if so, then that move is illegal
            return;
        }
        move.fenResult = simulation.fen.fen;
        // if we can take the opponent's king if the
        // opponent does nothing, then it's a check
        simulation.playNone();
        if (simulation.currentPlayer.canCaptureKing()) {
            move.check = true;
        }
        this.addMove(move);
    }
    canMove(rank, file) {
        return (this.inBoundaries(rank, file) && (this.panelEmpty(rank, file) || this.canCapture(rank, file)));
    }
    panelEmpty(rank, file) {
        const panelPiece = this.boardRef.get(rank, file);
        return panelPiece === ".";
    }
    canCapture(rank, file) {
        const panelPiece = this.boardRef.get(rank, file);
        return panelPiece !== "." && !sameFaction(this.faction, panelPiece);
    }
    inBoundaries(rank, file) {
        return rank >= 0 && rank <= 7 && file >= 0 && file <= 7;
    }
    move(move) {
        this.hasMoved = true;
        this.rank = move.to.rank;
        this.file = move.to.file;
    }
}
class Pawn extends Piece {
    constructor(faction, rank, file, gameRef) {
        super(faction, rank, file, gameRef);
        this.code = factionCode(faction, "P");
        this.value = 1;
    }
    generateMoves() {
        this.moves = [];
        this.checkSpecialMove();
        this.checkNormalMove();
        this.checkCrossCapture();
        this.checkEnPassant();
    }
    checkSpecialMove() {
        let targets;
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
        }
        if (targets && this.panelEmpty(...targets[0]) && this.panelEmpty(...targets[1])) {
            this.validateMove(...targets[0]);
        }
    }
    checkNormalMove() {
        let target;
        if (this.faction === "w") {
            target = [this.rank - 1, this.file];
        } else {
            target = [this.rank + 1, this.file];
        }
        if (this.inBoundaries(...target) && this.panelEmpty(...target)) {
            this.validateMove(...target);
        }
    }
    checkCrossCapture() {
        let targets;
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
                this.validateMove(...targets[i]);
            }
        }
    }
    checkEnPassant() {
        if (this.fenRef.fenEnPassant !== "-") {
            const [eprank, epfile] = convertUciLocation(this.fenRef.fenEnPassant);
            const eligibleRank = (this.faction === "w" && this.rank === 3) || (this.faction === "b" && this.rank === 4);
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
}
class King extends Piece {
    constructor(faction, rank, file, gameRef) {
        super(faction, rank, file, gameRef);
        this.code = factionCode(faction, "K");
        this.value = Number.POSITIVE_INFINITY;
    }
    generateMoves() {
        this.moves = [];
        const targets = [
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
        const castleFen = this.gameRef.fen.fenCastle;
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
    validateCastleMove(code) {
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
class Queen extends Piece {
    constructor(faction, rank, file, gameRef) {
        super(faction, rank, file, gameRef);
        this.code = factionCode(faction, "Q");
        this.value = 9;
    }
    generateMoves() {
        this.moves = [];
        const targets = [
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
class Bishop extends Piece {
    constructor(faction, rank, file, gameRef) {
        super(faction, rank, file, gameRef);
        this.code = factionCode(faction, "B");
        this.value = 3;
    }
    generateMoves() {
        this.moves = [];
        const targets = [
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
class Knight extends Piece {
    constructor(faction, rank, file, gameRef) {
        super(faction, rank, file, gameRef);
        this.code = factionCode(faction, "N");
        this.value = 3;
    }
    generateMoves() {
        this.moves = [];
        const targets = [
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
class Rook extends Piece {
    constructor(faction, rank, file, gameRef) {
        super(faction, rank, file, gameRef);
        this.code = factionCode(faction, "R");
        this.value = 5;
    }
    generateMoves() {
        this.moves = [];
        const targets = [
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
class Move {
    constructor(fromRank, fromFile, toRank, toFile, piece, faction) {
        this.from = {
            rank: fromRank,
            file: fromFile,
        };
        this.to = {
            rank: toRank,
            file: toFile,
        };
        this.piece = piece;
        this.faction = faction;
        this.capture;
        this.check;
        this.checkmate;
        this.promotion;
        this.castle;
        this.capturedPiece;
        this.enpassant;
        this.san = "";
        this.lan = "";
        this.uci = "";
        this.fenResult = "";
    }
    generate() {
        this.generateSanLan();
        this.generateUci();
    }
    generateSanLan() {
        if (this.castle) {
            const code = this.castle.toUpperCase();
            if (code === "K") {
                this.lan = "O-O";
                this.san = "O-O";
            } else if (code === "Q") {
                this.lan = "O-O-O";
                this.san = "O-O-O";
            } else {
                throw "(Move) this.castle should be either K/k/Q/q!";
            }
            return;
        }
        let lan = "";
        let san = "";
        let piece = this.piece.toUpperCase();
        if (piece !== "P") {
            lan += piece;
            san += piece;
        }
        const from = convertRankFile(this.from.rank, this.from.file);
        lan += from;
        if (piece === "P" && this.capture) {
            san += from[0] + "x";
        } else if (this.capture) {
            lan += "x";
            san += "x";
        }
        const to = convertRankFile(this.to.rank, this.to.file);
        lan += to;
        san += to;
        if (this.checkmate) {
            lan += "#";
            san += "#";
        } else if (this.check) {
            lan += "+";
            san += "+";
        }
        this.lan = lan;
        this.san = san;
    }
    generateUci() {
        let uci = "";
        uci += convertRankFile(this.from.rank, this.from.file);
        uci += convertRankFile(this.to.rank, this.to.file);
        this.uci = uci;
    }
    sanAddFromFile() {
        const from = this.#sanAddFrom();
        this.san = this.san[0] + from[0] + this.san.slice(1);
    }
    sanAddFromRank() {
        const from = this.#sanAddFrom();
        this.san = this.san[0] + from[1] + this.san.slice(1);
    }
    sanAddFromBoth() {
        this.san = this.lan;
    }
    #sanAddFrom() {
        const from = convertRankFile(this.from.rank, this.from.file);
        let piece = this.piece.toUpperCase();
        if (piece === "P" || piece === "K") {
            throw "pawn and knight should have no disambiguation";
        }
        return from;
    }
}
class GameHistory {
    constructor(game) {
        this.game = game;
        this.fens = [game.fen.fen];
        this.moves = [];
        this.history = {};
    }
    update(move) {
        this.moves.push(move);
        this.fens.push(this.game.fen.fen);
        this.appendHistory(move);
    }
    // TODO: undo/takeback
    undo() {
        if (this.moves.length === 0) {
            throw "you haven't made any moves yet!";
        }
        this.moves.pop();
        this.fens.pop();
        return this.fens[this.fens.length - 1];
    }
    appendHistory(move) {
        let turn = this.game.fen.fenFullmove;
        if (move.faction === "w") {
            this.history[turn] = [move.san];
        } else {
            turn--;
            this.history[turn].push(move.san);
        }
    }
    createPgn() {
        let pgn = "";
        for (const turn in this.history) {
            pgn += turn.toString() + ". ";
            pgn += this.history[turn].join(" ") + " ";
        }
        pgn = pgn.slice(0, -1);
        return pgn;
    }
}
class Chess {
    constructor(fen, simulation = false) {
        this.fen = new Fen(fen);
        this.board = new Board(this.fen.fenBoard);
        this.pwhite = new Player("w", this);
        this.pblack = new Player("b", this);
        this.turn = this.fen.fenTurn;
        this.currentPlayer = this.pwhite;
        this.simulation = simulation;
        this.updateTurn();
        this.currentPlayer.generatePossibleMoves();
        this.data = this.getData();
    }
    play(move) {
        if (typeof move === "string") {
            move = this.currentPlayer.getMoveFromString(move);
        }
        this.board.update(move);
        this.fen.update(move, this.board.board);
        this.currentPlayer.updatePiecePosition(move);
        this.updateTurn();
        if (move.enpassant) {
            this.currentPlayer.removePiece(move.from.rank, move.to.file);
        } else if (move.capture) {
            this.currentPlayer.removePiece(move.to.rank, move.to.file);
        }
        this.currentPlayer.generatePossibleMoves();
        if (!this.simulation) {
            this.data = this.getData();
        }
    }
    info() {
        console.log(this.fen.fen);
        this.board.display();
        console.log(`${this.currentPlayer.name} to move`);
        console.log("Possible moves:");
        console.log(this.currentPlayer.getSanMoves());
    }
    playNone() {
        this.fen.updateTurn();
        this.fen.updateFen();
        this.updateTurn();
        this.currentPlayer.generatePossibleMoves();
    }
    updateTurn() {
        this.turn = this.fen.fenTurn;
        if (this.turn === "b") {
            this.currentPlayer = this.pblack;
        } else if (this.turn === "w") {
            this.currentPlayer = this.pwhite;
        } else {
            throw "turn must be either 'w' or 'b'";
        }
    }
    getData() {
        return {
            turn: this.turn,
            fen: this.fen.fen,
            board: this.board.board,
            moves: this.currentPlayer.possibleMoves,
        };
    }
}
module.exports = Chess;
