# GameZ Docs

## Loading GameZ

To load GameZ, use the script tag in your HTML:
```
<script src="https://pincescpu987.github.io/game-z/main.min.js"></script>
```
The source code can be found at [https://pincescpu987.github.io/game-z/main.js](https://pincescpu987.github.io/game-z/main.js)  
and the minified version at [https://pincescpu987.github.io/game-z/main.min.js](https://pincescpu987.github.io/game-z/main.min.js).

***

## Setting Up a New Game

GameZ is object-oriented. To start, create new ```Game``` and ```Screen``` objects, and ```Setup``` and ```Update``` functions, like this:

```
let game = new Game(60);
let screen = new Screen(640, 360);
async function Setup(game, screen){
  // This is executed once before the Update function.
  // Your starting setup code goes here...
}

function Update(game, screen){
  // This is executed once per frame.
  // Your repeating update code goes here...
}
game.startGame(screen);
```

Let's break this code down line by line.

```let game = new Game(60);```  
This line creates a new Game instance, required to start the game and also set the debug feature. The one parameter required is the FPS of the game.

```let screen = new Screen(640, 480);```  
This line creates a new Screen instance, required to create and access sprites in the game. Two parameters are for the width and height of the canvas created.

```async function Setup(game, screen){```  
This line creates an async function. Async is required only if you need to use one of several functions returning Promises with ```await```. This funcion uses ```game``` and ```screen``` references to work with sprites.

```function Update(game, screen){```  
The update function can be async, but **_the next frame will not wait for it_**. Async is only needed in the Setup function for loading files. This function also uses ```game``` and ```screen``` references to work with sprites.

Now, because you are using ```async``` functions, it may help to add something like this to your code, to accept and report errors:  
```
window.onunhandledrejection = function(errorEvent) {
  document.body.removeChild(document.querySelector('canvas')); // Remove the canvas to stop rendering.
	document.body.style.overflow = 'visible';
	if(_DEBUG){
    document.body.innerHTML = `<div style="margin: 10px;"><h1>🤔</h1><h1>Hmmm...</h1><p>There's an error in your code.</p><p>Here it is:</p><p>${errorEvent.reason.stack.split('\n').join('<br>').split(' ').join('&nbsp;')}</p></div>`
	} else {
  	document.body.innerHTML = `<div style="margin: 10px;"><h1>🤔</h1><h1>Hmmm...</h1><p>Something went wrong.</p></div>`
  }
}
```

The framework is based on the HTML Canvas element, so removing the canvas to stop rendering of the game is included in this snippet.

## Making the Game
