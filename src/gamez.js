/*
To load files, most websites do not support hotlinking.
Instead, download the file and use a data URI converter like mine:
https://pincescpu987.github.io/js_tools/binary/ (For mine, use the 'Generate data URI' button)
*/

/*jshint multistr: true */

let _DEBUG = false;
var _nu = [];
let _Sprites = {};

var mouseX = 0;
var mouseY = 0;

class SpriteNameError extends Error {
	constructor(message){
  	super(message);
    this.name = "SpriteNameError";
  }
}

class SpriteCreationError extends Error {
	constructor(message){
  	super(message);
    this.name = "SpriteCreationError";
  }
}

class CostumeError extends Error {
	constructor(message){
  	super(message);
    this.name = "CostumeError";
  }
}

class SoundNameError extends Error {
	constructor(message){
  	super(message);
    this.name = "SoundNameError";
  }
}

function pointTowardsXY(x1,y1,x2,y2){
	var direction = ((((Math.atan(((x2 - x1) / (y2 - y1))) / (Math.PI / 2)) * 90) + ((180) * (Number(y1 > y2)))));
  return direction;
}

function updateMouse(e){
	mouseX = e.offsetX;
  mouseY = e.offsetY;
}

class Game {
	constructor(){
  	_DEBUG = false;
    this.spriteList = {};
  }
  setDebug(s){
  	_DEBUG = !!s;
    if(_DEBUG){
    	console.log(`Set debug to ${_DEBUG}`)
    }
  }
}

class Screen {
	constructor(w,h){
    this.rect = new ScreenRect(w, h);
    this.canvas = document.createElement('canvas');
    this.bgColor = '#000000';
    this.canvas.onmousemove = function(e){
    	updateMouse(e);
    }
    this.canvas.width = this.rect.width;
    this.canvas.height = this.rect.height;
    document.body.appendChild(this.canvas);
  }
  createSprite(n){
  	try {
  		_Sprites[n] = new Sprite(n,this);
    } catch (err){
    	throw new SpriteCreationError(`Creation of sprite '${n}' went wrong.`);
    }
  }
  getSprite(n){
  	return _Sprites[n];
  }
  fillScreen(){
  	var ctx = this.canvas.getContext('2d');
    ctx.fillStyle = this.bgColor;
  	ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  	ctx.fill();
  }
  setBgColor(c){
  	this.bgColor = c;
  }
}

class Motion {
	constructor(p){
  	this.parent = p;
  }
  forward(p){
  	this.parent.rect.x += p * (Math.sin((this.parent.rect.direction / 90) * (Math.PI / 2)));
    this.parent.rect.y += p * (Math.cos((this.parent.rect.direction / 90) * (Math.PI / 2)));
    if(_DEBUG){
  		console.log(`Moved sprite '${this.parent.name}' forward ${p} pixels. New position is (${this.parent.rect.x}, ${this.parent.rect.y}).`);
    }
  }
  right(d){
  	if(_DEBUG){
    	console.log(`Turned sprite '${this.parent.name}' right ${d} degrees.`);
    }
    this.parent.rect.direction -= d;
    while ((this.parent.rect.direction > 180 && this.parent.rect.direction < Infinity) || (this.parent.rect.direction < -180 && this.parent.rect.direction > -Infinity)){
    	this.parent.rect.direction += this.parent.rect.direction > 0 ? -360 : 360;
    }
  }
  left(d){
  	if(_DEBUG){
    	console.log(`Turned sprite '${this.parent.name}' left ${d} degrees.`);
    }
    this.parent.rect.direction += d;
    while ((this.parent.rect.direction > 180 && this.parent.rect.direction < Infinity) || (this.parent.rect.direction < -180 && this.parent.rect.direction > -Infinity)){
    	this.parent.rect.direction += this.parent.rect.direction > 0 ? -360 : 360;
    }
  }
  goToXY(x, y){
  	this.parent.rect.x = x;
    this.parent.rect.y = y;
    if(_DEBUG){
    	console.log(`Sent sprite '${this.parent.name}' to position (${x}, ${y}).`);
    }
  }
  goTo(t){
  	if(t == 'random'){
    	var x = Math.floor(Math.random() * this.parent.screen.rect.width);
      var y = Math.floor(Math.random() * this.parent.screen.height);
      this.parent.rect.x = x;
      this.parent.rect.y = y;
      if(_DEBUG){
        console.log(`Sent sprite '${this.parent.name}' to random position (${x}, ${y}).`)
      }
    } else if(t == 'mouse'){
    	var x = mouseX;
      var y = mouseY;
      this.parent.rect.x = x;
      this.parent.rect.y = y;
      if(_DEBUG){
      	console.log(`Sent sprite '${this.parent.name}' to mouse position at (${x}, ${y}).`)
      }
    } else {
    	var x = t.rect.x;
      var y = t.rect.y;
      this.parent.rect.x = x;
      this.parent.rect.y = y;
      if(_DEBUG){
      	console.log(`Sent sprite '${this.parent.name}' to sprite '${t.name}' at position (${x}, ${y}).`);
      }
    }
  }
  point(d){
  	var direction = d;
    this.parent.rect.direction = direction;
    if(_DEBUG){
    	console.log(`Pointed sprite '${this.parent.name}' in direction ${direction}.`)
    }
  }
  pointTowards(obj){
  	var direction;
    if(obj == 'mouse'){
      var direction = pointTowardsXY(this.parent.rect.x, this.parent.rect.y, mouseX, mouseY);
      if(_DEBUG){
      	console.log(`Pointed sprite '${this.parent.name}' towards the mouse. Direction of this sprite is now ${direction}`);
      }
    } else if(obj instanceof Sprite){
    	var direction = pointTowardsXY(this.parent.rect.x, this.parent.rect.y, obj.rect.x, obj.rect.y)
    } else {
    	throw new ObjectError(`Cannot point to ${obj}. Options are an existing Sprite object or 'mouse'.`);
    }
    this.parent.rect.direction = direction;
  }
  pointTowardsXY(x, y){
  	var direction = pointTowardsXY(this.parent.rect.x, this.parent.rect.y, x, y);
    if(_DEBUG){
    	console.log(`Pointed sprite '${this.parent.name}' towards (${x}, ${y}). New direction is ${direction}.`)
    }
    this.parent.rect.direction = direction
  }
  changeX(p){
    this.parent.rect.x += p;
    if(_DEBUG){
      console.log(`Changed X position of sprite '${this.parent.name}' by ${p}. New Y position is ${this.parent.rect.x}`)
    }
  }
  setX(p){
    this.parent.rect.x = p;
    if(_DEBUG){
      console.log(`Set X position of sprite '${this.parent.name}' to ${p}.`);
    }
  }
  changeY(p){
    this.parent.rect.y += p;
    if(_DEBUG){
      console.log(`Changed Y position of sprite '${this.parent.name}' by ${p}. New Y position is ${this.parent.rect.y}`)
    }
  }
  setY(p){
    this.parent.rect.y = p;
    if(_DEBUG){
      console.log(`Set Y position of sprite '${this.parent.name}' to ${p}.`);
    }
  }
}

class Looks {
	constructor(p){
  	this.parent = p;
    this.costumes = {};
    this.costumeNames = [];
    this.costume = 0;
  }
  addCostume(n,u){
  	var img = document.createElement('img');
    img.style.display = 'none';
    img.src = u;
    document.body.appendChild(img);
    this.costumes[n] = {url: u, object: img};
    this.costumeNames.push(n);
    if(_DEBUG){
    	console.log(`Loading costume '${n}' from '${u}'...`)
    }
    return new Promise((resolve) => {
    	img.onload = combineFunctions(resolve, function(){console.log(`Done loading image '${n}' from '${u}'.`)});
    });
  }
  setCostume(c){ //ssetCostume
  	if(typeof c == "string"){
      if(this.costumeNames.includes(c)){
        this.costume = c;
        this.parent.rect.width = this.costumes[c].object.naturalWidth;
        this.parent.rect.height = this.costumes[c].object.naturalHeight;
        if(_DEBUG){
        	console.log(`Set costume of sprite '${this.parent.name}' to costume '${c}'. Width and height are (${this.parent.rect.width}, ${this.parent.rect.height}).`);
        }
        return;
      }
      throw new CostumeError(`Costume name '${c}' does not exist for sprite '${this.parent.name}'.`);
    } else if(typeof c == "number"){
    	if(c >= 0 && c < this.costumeNames.length && Number.isInteger(c)){
      	this.costume = this.costumeNames[c];
        this.parent.rect.width = this.costumes[this.costume].object.naturalWidth;
        this.parent.rect.height = this.costumes[this.costume].object.naturalHeight;
        if(_DEBUG){
        	console.log(`Set costume of sprite '${this.parent.name}' to costume with index ${c}. Name of costume is '${this.costumes[this.costumeNames[c]].name}'. \
Width and height are (${this.parent.rect.width}, ${this.parent.rect.height}).`)
        }
      } else {
      	throw new CostumeError(`Costume ID ${c} is not valid for sprite '${this.parent.name}'.`)
      }
    }
  }
  say(s){
  	if(_DEBUG){
    	console.log(`Sprite '${this.parent.name}' said '${s}'.`);
    }
  }
  sayFor(s,t){
  	if(_DEBUG){
    	console.log(`Sprite '${this.parent.name}' saying '${s}' for ${t} milliseconds.`);
    }
    return new Promise(resolve => {setTimeout(combineFunctions(function(){console.log('Done.')}, resolve), t)})
  }
  show(){
  	var cnv = this.parent.screen.canvas;
    var ctx = cnv.getContext('2d');
  	ctx.drawImage(this.costumes[this.costume].object, this.parent.rect.x - (this.parent.Looks.costumes[this.parent.Looks.costume].object.width / 2), this.parent.rect.y - (this.parent.Looks.costumes[this.parent.Looks.costume].object.height / 2));
  }
}

var j;
function combineFunctions(f11, f22){
	return function(){
  	f11();
    f22();
  }
}

var soundObject;

class Sound {
	constructor(p){
  	this.parent = p;
    this.sounds = [];
  }
  addSound(n,u){
 		var obj = new Audio();
    obj.controls = false;
    document.body.appendChild(obj)
  	obj.src = u;
    this.sounds.push({name: n, url:u, audioObject: obj});
    if(_DEBUG){
    	console.log(`Added sound '${n}' from '${u}'.`)
    }
    return new Promise((resolve) => {
    	obj.onload = combineFunctions(resolve, function(){console.log(`Done loading sound '${n}' from '${u}'.`)});
    });
  }
  startSound(n){
  	for(var i = 0; i < this.sounds.length; i++){
    	if(this.sounds[i].name == n){
      	this.sounds[i].audioObject.currentTime = 0;
      	this.sounds[i].audioObject.play();
        if(_DEBUG){
        	console.log(`Started sound '${n}' in sprite '${this.parent.name}'.`)
        }
        return;
      }
    }
    throw new SoundNameError(`Could not find sound '${n}' in sprite '${this.parent.name}'.`)
  }
  playSound(n){
  	for(var i = 0; i < this.sounds.length; i++){
    	if(this.sounds[i].name == n){
      	j = i;
        this.sounds[i].audioObject.currentTime = 0;
      	this.sounds[i].audioObject.play();
        if(_DEBUG){
        	console.log(`Playing sound '${n}'...`);
        }
        return new Promise(resolve => {soundObject = this.sounds[j].audioObject; this.sounds[j].audioObject.onended = combineFunctions(function(){if(_DEBUG){console.log('Done.'); soundObject.onended = null;}}, resolve);});
      }
    }
    throw new SoundNameError(`Could not find sound '${n}'`)
    return new Promise(resolve => {resolve();});
  }
  setVolume(v){
  	for(var i = 0; i < this.sounds.length; i++){
    	if(v < 0){this.sounds[i].audioObject.volume = 0; continue;}
      if(v > 100){this.sounds[i].audioObject.volume = 1; continue;}
    	this.sounds[i].audioObject.volume = v / 100;
    }
    if(_DEBUG){
    	console.log(`Set volume for sprite '${this.parent.name}' to ${Math.round(this.sounds[0].audioObject.volume * 100)}.`)
    }
  }
  changeVolume(v){
  	for(var i = 0; i < this.sounds.length; i++){
    	if(this.sounds[i].audioObject.volume * 100 > 100 - v && v > 0){this.sounds[i].audioObject.volume = 1; continue;}
      if(this.sounds[i].audioObject.volume * 100 < 0 + v && v < 0){this.sounds[i].audioObject.volume = 0; continue;}
    	this.sounds[i].audioObject.volume += v / 100;
   	}
    if(_DEBUG){
    	console.log(`Changed sound volume for sprite '${this.parent.name}' by ${v}. New volume is ${Math.round(this.sounds[0].audioObject.volume * 100)}.`)
    }
  }
  stopAll(){
  	for(var i = 0; i < this.sounds.length; i++){
    	this.sounds[i].audioObject.pause();
      this.sounds[i].audioObject.currentTime = 0;
    }
    if(_DEBUG){
    	console.log(`Stopped all sounds in sprite '${this.parent.name}'`)
    }
  }
}

class Control {
	constructor(p){
  	this.p = parent;
  }
	wait(m) {
  	return new Promise(function(resolve, reject){
    	setTimeout(resolve, m);
    });
  }
}

class Sensing {
	constructor(p){
  	this.parent = p;
  }
  touching(o){
  	if(o == 'mouse'){
    	return (this.parent.rect.x - (this.parent.rect.width / 2) <= mouseX && this.parent.rect.x - (this.parent.rect.width / 2) > mouseX - this.parent.rect.width) && (this.parent.rect.y - (this.parent.rect.height / 2) <= mouseY && this.parent.rect.y - (this.parent.rect.height / 2) > mouseY - this.parent.rect.height)
    }
    if(o == 'bottom-edge'){
      return ((this.parent.rect.y + (this.parent.rect.height / 2)) >= this.parent.screen.rect.height);
    }
    if(o == 'top-edge'){
      return ((this.parent.rect.y - (this.parent.rect.height / 2)) <= 0);
    }
    if(o == 'left-edge'){
      return ((this.parent.rect.x - (this.parent.rect.width / 2)) <= 0);
    }
    if(o == 'right-edge'){
      return ((this.parent.rect.x + (this.parent.rect.width / 2)) >= this.parent.screen.rect.width);
    }
    if(o instanceof Sprite){
      return (this.parent.rect.x - (this.parent.rect.width / 2) <= o.rect.x + (o.rect.width / 2) && this.parent.rect.x - (this.parent.rect.width / 2) > this.parent.rect.x - (this.parent.rect.width / 2)) && (this.parent.rect.y - (this.parent.rect.height / 2) <= o.rect.y + (o.rect.height / 2) && this.parent.rect.y - (this.parent.rect.height / 2) > this.parent.rect.y - (this.parent.rect.height / 2))
    }
  }
  distanceTo(o){
    if(o == 'mouse'){
      return Math.sqrt(Math.pow(mouseX - this.parent.rect.x, 2) + Math.pow(mouseY - this.parent.rect.y, 2))
    }
    if(o instanceof Sprite){
      return Math.sqrt(Math.pow(o.rect.x - this.parent.rect.x, 2) + Math.pow(o.rect.y - this.parent.rect.y, 2))
    }
  }
}

class Rect{
	constructor(p){
  	this.x = 0;
    this.y = 0;
    this.direction = 90;
    this.parent = p;
  }
}

class ScreenRect extends Rect {
  constructor(w, h){
    super();
    this.parent = null;
    this.direction = null;
    this.width = w;
    this.height = h;
  }
}

class Sprite{
	constructor(n,s){
    this.rect = new Rect(this);
    this.screen = s;
  	if(_nu.includes(n)){
      throw new SpriteNameError(`A sprite with the name '${n}' already exists. Names not available are as follows:\n${JSON.stringify(_nu)}`);
    } else {
      this.name = n;
      _nu += n;
    }
    this.Motion = new Motion(this);
    this.Looks = new Looks(this);
    this.Sensing = new Sensing(this);
    this.Sound = new Sound(this);
    this.Control = new Control(this);
    if(_DEBUG){
    	console.log(`Created sprite with name '${n}'`);
    }
  }
}
