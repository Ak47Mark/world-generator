const playerPos = {x: 8, y: 8};
const player = document.querySelector("#player");
const up = "KeyW";
const down = "KeyS";
const left = "KeyA";
const right = "KeyD";
const stepSize = 0.1;
const footsptepGrass = new Audio("sounds/footstep.wav");
const footsptepWater1 = new Audio("sounds/footstep-water-1.wav");
const footsptepWater2 = new Audio("sounds/footstep-water-2.wav");
const birds = new Audio("sounds/birds.wav");

birds.loop = true;

//movement event handler

var upKeyPressed = false;
var downKeyPressed = false;
var leftKeyPressed = false;
var rigtKeyPressed = false;

document.addEventListener("keydown", function(event) {
  birds.play();

  if (event.code === left) {
    leftKeyPressed = true;
  }
  if (event.code === right) {
    rigtKeyPressed = true;
  }
  if (event.code === up) {
    upKeyPressed = true;
  }
  if (event.code === down) {
    downKeyPressed = true;
  }
});

document.addEventListener("keyup", function(event) {
    if (event.code === left) {
      leftKeyPressed = false;
    }
    if (event.code === right) {
      rigtKeyPressed = false;
    }
    if (event.code === down) {
      downKeyPressed = false;
    }
    if (event.code === up) {
      upKeyPressed = false;
    }
});

setInterval(function() {
  if (upKeyPressed) {
    playerPos.x -= stepSize; //fel
    playerPos.y -= stepSize;
  }
  if (downKeyPressed) {
    playerPos.x += stepSize; //le
    playerPos.y += stepSize;
  }
  if (leftKeyPressed) {
    playerPos.y += stepSize; //bal
    playerPos.x -= stepSize;
  }
  if (rigtKeyPressed) {
    playerPos.y -= stepSize; //jobb
    playerPos.x += stepSize;
  }

  if( upKeyPressed || downKeyPressed || leftKeyPressed || rigtKeyPressed){
    if(map[Math.floor(playerPos.y)][Math.floor(playerPos.x)] > 1){
      footsptepGrass.play();
    }else{
      footsptepWater1.play();
      footsptepGrass.pause();
    }
  }else{
    footsptepGrass.pause();
  }

  player.style.left = Math.round(playerPos.x*32) + "px";
  player.style.top = Math.round(playerPos.y*32) + "px";
  camera();
}, 50);

setInterval(function() {
    console.log(playerPos.x, playerPos.y);
    if(playerPos.x > Object.keys(map[Math.floor(playerPos.y)]).length - 3){
        console.log("X");
        newX = Math.floor(playerPos.x/16)*16 +16;
        newY = Math.floor(playerPos.y/16)*16;
        generate(newX, newY);
        draw();
        console.log(map);
    }
    if(playerPos.y > Object.keys(map).length - 3){
        console.log(map[Math.floor(playerPos.y)][Math.floor(playerPos.x)]);
        newX = Math.floor(playerPos.x/16)*16;
        newY = Math.floor(playerPos.y/16)*16 +16;
        generate(newX, newY);
        draw();
        console.log(map);
    }
},500)

function camera(){
  let camerax = 300;
  let cameray = 515;
  let display = document.querySelector('#display');

  //camerax += Math.sqrt(Math.pow(playerPos.y * 32, 2) + Math.pow(playerPos.x * 32, 2)); //playerPos.x;
  //cameray += Math.sqrt(Math.pow(playerPos.y * 32, 2) + Math.pow(playerPos.x * 32, 2)); //playerPos.x;

  camerax -= playerPos.x * 32;
  cameray -= playerPos.y * 32;
  
  display.style.marginTop = camerax + "px";
  display.style.marginLeft = cameray + "px";
  

}