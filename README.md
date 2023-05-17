# GameZ Docs

## Loading GameZ

To load GameZ, use the script tag in your HTML:
```
<script src="https://pincescpu987.github.io/game-z/main.min.js"></script>
```
The source code can be found at [https://pincescpu987.github.io/game-z/main.js](https://pincescpu987.github.io/game-z/main.js)  
and the minified version at [https://pincescpu987.github.io/game-z/main.min.js](https://pincescpu987.github.io/game-z/main.min.js).

***

## Using GameZ

GameZ is object-oriented. To start, create ```Game``` and ```Screen``` objects, like this:

```
let game = new Game;
let screen = new Screen;
async function run(game, screen){
  // your game code goes here...
}
```
