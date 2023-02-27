# logichess

logichess is a TypeScript library that provides a set of classes to handle chess game logic. It can be used to create custom chess games, validate moves, get legal moves, and other useful functionalities related to chess.

## Installation

To install logichess, you need to have npm installed. Then run the following command:

```
npm i logichess
```

## Usage

To use logichess in your TypeScript or JavaScript project, import the module using either CommonJS or ES6 import syntax.

```javascript
// Common JS
const { Chess } = require("logichess");
// ES Module
import { Chess } from "logichess";
```

### Creating a new game

You can create a new game by simply initializing a new instance of the `Chess` class:

```javascript
const game = new Chess();
```

This will create a new game with the default starting position.

Alternatively, you can create a custom game by passing a [FEN](https://en.wikipedia.org/wiki/Forsyth–Edwards_Notation) string to the constructor:

```javascript
const fenString =
  "r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 5 4";
const customGame = new Chess(fenString);
```

### Retrieving game information

Once you have a Chess instance, you can retrieve information about the game state by accessing its properties:

```javascript
console.log(game.data);
```

Which will log the following data:

```javascript
{
  status: 'normal',
  difference: 0,
  turn: 'w',
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  board: [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ],
  moves: [
    {
      from: { rank: 6, file: 0 },
      to: { rank: 4, file: 0 },
      piece: 'P',
      faction: 'w',
      san: 'a4',
      lan: 'a2a4',
      uci: 'a2a4',
      fenResult: 'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1'
    },
    {
      from: { rank: 6, file: 0 },
      to: { rank: 5, file: 0 },
      piece: 'P',
      faction: 'w',
      san: 'a3',
      lan: 'a2a3',
      uci: 'a2a3',
      fenResult: 'rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1'
    },
    // ... more moves below
  ]
}
```

This will log an object containing the following properties:

- `status` - the status of the game ("normal", "check", "end")
- `difference` - the difference in material value between the two sides
- `turn` - the side to move ("w" for white, "b" for black)
- `fen` - the FEN string representing the current position
- `board` - a two-dimensional array representing the current position on the board
- `moves` - an array containing all legal moves in the current position

### Making a move

To make a move, call the `play` method on the Chess instance, passing the move in either SAN, LAN, or UCI format as a string:

```javascript
// using SAN
game.play("e4");
// using LAN
game.play("e2e4");
// using UCI
game.play("e2-e4");
```

You can also pass a Move object as the parameter:

```javascript
game.play({
  from: { rank: 6, file: 4 },
  to: { rank: 4, file: 4 },
  piece: "P",
  faction: "w",
  san: "e4",
  lan: "e2e4",
  uci: "e2e4",
  fenResult: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
});
```

To learn more about the Move object, [read the source file](https://github.com/yosuanicolaus/logichess/blob/main/src/move.ts).

The `play` method will update the game state with the new position resulting from the move.
If the move is not legal, an exception will be thrown.

## Contributing

Thank you for considering contributing to logichess! If you would like to contribute, please follow these steps:

- Fork the repository and create your branch from main.
- Clone the repository and install dependencies: npm install
- Commit your changes and push your branch.
- Open a pull request.

You can also suggest new features to be added by opening new issues about it.
Here's a small list of to be implemented features for starters:

- `validateMove` - check if a move is legal in the current position
- `getMoveHistory` - get an array of all moves played in the game so far
- `undo` - undo the last move played

## License

logichess is released under the MIT License. See [LICENSE](https://github.com/yosuanicolaus/logichess/blob/main/LICENSE) for details.
