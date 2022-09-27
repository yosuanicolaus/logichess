# logichess

A chess programming library in TypeScript

Install:

```
npm i logichess
```

# Usage:

- Import module

```javascript
// Common JS
const { Chess } = require("logichess");
// ES Module
import { Chess } from "logichess";
```

- Create new game

```javascript
const game = new Chess();
// Or if you want custom game, (need FEN)
const fenString =
  "r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 5 4";
const customGame = new Chess(fenString);
```

When creating a new Chess object, it will automatically calculate all possible/legal moves that you can choose to play, along with other useful informations like whose turn, is it in check, material difference, and also board display.

```javascript
console.log(game.data);

/* logs:
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
      from: {
        rank: 6,
        file: 0,
      },
      to: {
        rank: 4,
        file: 0,
      },
      piece: 'P',
      faction: 'w',
      san: 'a4',
      lan: 'a2a4',
      uci: 'a2a4',
      fenResult: 'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1'
    },
    {
      from: {
        rank: 6,
        file: 0,
      },
      to: {
        rank: 5,
        file: 0,
      },
      piece: 'P',
      faction: 'w',
      san: 'a3',
      lan: 'a2a3',
      uci: 'a2a3',
      fenResult: 'rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1'
    },
    
    ...
  ]
}
 */
```
