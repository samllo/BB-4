// variables and gsap setup
const appHeight = 600;
const appWidth = 700;
const radius = 30;
let velocity = 2;
gsap.registerPlugin();
gsap.registerEffect({});

// canvas setup
const app = new PIXI.Application({
  width: appWidth,
  height: appHeight,
  antialias: true,
  transparent: false,
  resolution: 1,
  backgroundColor: 0xeeeeee
});

document.getElementById("screen").appendChild(app.view);
const stage = app.stage;

// Global ticker and empty variable for classes
let ticker = PIXI.Ticker.shared;
let v;
let x;
let y;
let gravity = 0.1;
let ballSpeed = 10;

//Ball creation class, random number generation dictates xy direction and position
class Circle {
  constructor(radius, x = Math.random() * appWidth , y = Math.random() * appHeight, colour ) {
      const ball = new PIXI.Graphics();
      ball.lineStyle(0); 
      ball.beginFill(colour, 1);
      ball.drawCircle( 0, 0, radius);
      this.radius = radius;
      ball.endFill();
      ball.pivot.x = radius/2;
      ball.pivot.y =  radius/2;
      ball.x =  x;
      ball.y =  y;
      ball.velocityx = Math.random() < 0.5 ? -ballSpeed  : ballSpeed;
      ball.velocityy = Math.random() < 0.5 ? -ballSpeed  : ballSpeed;
      app.stage.addChild(ball);
      this.ball= ball;
  }

}

//Extends ball creation class with a method thatn can be updated using update loop set of by ticker

// x/y direction is reveresed when balls anchor reaches limits of appheight and width
class CIRCLES extends Circle {
  update() {
    if (this.ball.y + radius >= appHeight ) {
      this.ball.velocityy = -this.ball.velocityy
      this.ball.y = appHeight  - radius
    }
    // top 
    if (this.ball.y - radius <= 0) {
      this.ball.velocityy = -this.ball.velocityy
      this.ball.y = radius
    }
  
    // left 
    if (this.ball.x - radius <= 0) {
      this.ball.velocityx = -this.ball.velocityx
      this.ball.x = radius
    }
    
    // right 
    if (this.ball.x + radius >= appWidth) {
      this.ball.velocityx= -this.ball.velocityx
      this.ball.x = appWidth - radius
    }
    this.ball.velocityy += gravity; // gravity add
    this.ball.x += this.ball.velocityx;
    this.ball.y += this.ball.velocityy;
  }

}

//For loop places 25 balls into circle array
let Circlearray=[];
for (let i = 0; i < 25; i++) {
  Circlearray.push(new CIRCLES (radius,x ,y, 0xDE3249));
}

// ticker triggers update() method of CIRCLES
let delta = 1;
ticker.add((delta) => {
  Circlearray.forEach(c => {
    c.update();
  })
}

/* Buttons images for pressed unpressed*/
const textureButton = PIXI.Texture.from('images/bluebut.png');
const textureButtonDown = PIXI.Texture.from('images/redbut.png');
const buttons = [];


// button posiiton in array and for loop creating 3
const buttonPositions = [
    100, 500,
    200, 500,
    300, 500,
]

for (let i = 0; i < 3; i++) {
  const button = new PIXI.Sprite(textureButton);
  button.anchor.set(0.5);
  button.x = buttonPositions[i * 2];
  button.y = buttonPositions[i * 2 + 1];
  // interactive
  button.interactive = true;
  button.buttonMode = true;
  button
  app.stage.addChild(button);
  buttons.push(button);
}

buttons[0].scale.set(0.1);
buttons[1].scale.set(0.1);
buttons[2].scale.set(0.1);


// Struggled to minimise all these function calls
buttons[0].on('mousedown', button0D)
buttons[0].on('mouseup', button0U)
buttons[0].on('mouseover', movebutton1)
buttons[0].on('mouseout', movebutton1back)

function button0D(){
  gravity = 1.2;
  this.texture = textureButtonDown;
  this.alpha = 1;
  this.isdown = true;
}

function button0U(){
  gravity = 0.1;
  this.texture = textureButton;
  this.isdown = false;
}

buttons[1].on('mousedown', button1D)
buttons[1].on('mouseup', button1U)
buttons[1].on('mouseover', movebutton2)
buttons[1].on('mouseout', movebutton2back)

function button1D(){
  Circlearray.push(new CIRCLES (radius,x ,y,0x0000FF))
  this.texture = textureButtonDown;
  this.alpha = 1;
  this.isdown = true;
}

function button1U(){
  this.texture = textureButton;
  this.isdown = false;
}

buttons[2].on('mousedown', button2D)
buttons[2].on('mouseup', button2U)
buttons[2].on('mouseover', movebutton3)
buttons[2].on('mouseout', movebutton3back)

function button2D(){
  this.texture = textureButtonDown;
  this.alpha = 1;
  this.isdown = true;
  ticker.stop();
}

function button2U(){
  this.texture = textureButton;
  this.isdown = false;
  ticker.start();
}

//effects

// basic scale change on hover, couldn't get fades to work
function movebutton1() {
  TweenMax.to(buttons[0].scale.set(0.12));
}
function movebutton1back() {
  TweenMax.to(buttons[0].scale.set(0.1));
}

function movebutton2() {
  TweenMax.to(buttons[1].scale.set(0.12));
}
function movebutton2back() {
  TweenMax.to(buttons[1].scale.set(0.1));
}

function movebutton3() {
  TweenMax.to(buttons[2].scale.set(0.12));
}
function movebutton3back() {
  TweenMax.to(buttons[2].scale.set(0.1));
}

// Text

text = new PIXI.Text("Gravity");
text.x = 100;
text.y = 550;
text.anchor.set(0.5);
text.style = new PIXI.TextStyle({
  fill: 0x000000,
  fontSize: 20,
  fontFamily: "Orbitron"
})
app.stage.addChild(text)

text2 = new PIXI.Text("Add Ball");
text2.x = 200;
text2.y = 550;
text2.anchor.set(0.5);
text2.style = new PIXI.TextStyle({
  fill: 0x000000,
  fontSize: 20,
  fontFamily: "Orbitron"
})

app.stage.addChild(text2)

text3 = new PIXI.Text("Stop!");
text3.x = 300;
text3.y = 550;
text3.anchor.set(0.5);
text3.style = new PIXI.TextStyle({
  fill: 0x000000,
  fontSize: 20,
  fontFamily: 'Orbitron';
})

app.stage.addChild(text3)

