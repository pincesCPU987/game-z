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

GameZ is object-oriented. To start, create new ```Game``` and ```Screen``` objects, and ```Setup``` and ```Update``` functions, like this:

```
let game = new Game();
let screen = new Screen(640, 360);
async function Setup(game, screen){
  // This is executed once before the Update function.
  // Your starting setup code goes here...
}

async function Update(game, screen){
  // This is executed once per frame.
  // Your repeating update code goes here...
}
```
