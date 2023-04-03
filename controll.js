const playerPos = {x: 8, y: 8};
const cameraPos = {x: 0, y: 0};
const player = document.querySelector("#player");
const up = "KeyW";
const down = "KeyS";
const left = "KeyA";
const right = "KeyD";
const shift = "ShiftLeft";
const speed = 0.1;
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
var fhiftKeyPressed = false;

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
  if (event.code === shift) {
    fhiftKeyPressed = true;
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
    if (event.code === shift) {
      fhiftKeyPressed = false;
    }
});

function movement() {

  let walkspeed = 0;
  if(fhiftKeyPressed) {
    walkspeed = 0.5;
  }else{
    walkspeed = speed;
  }

  if (upKeyPressed) {
    playerPos.x -= walkspeed; //fel
    playerPos.y -= walkspeed;
    cameraPos.x += walkspeed;
  }
  if (downKeyPressed) {
    playerPos.x += walkspeed; //le
    playerPos.y += walkspeed;
    cameraPos.x -= walkspeed;
  }
  if (leftKeyPressed) {
    playerPos.y += walkspeed; //bal
    playerPos.x -= walkspeed;
    cameraPos.y += walkspeed;
  }
  if (rigtKeyPressed) {
    playerPos.y -= walkspeed; //jobb
    playerPos.x += walkspeed;
    cameraPos.y -= walkspeed;
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
}

function extendMap() {
    if(playerPos.x > Object.keys(map[Math.floor(playerPos.y)]).length - 3){
        console.log("X");
        newX = Math.floor(playerPos.x/16)*16 +16;
        newY = Math.floor(playerPos.y/16)*16;
        generate(newX, newY);
        draw();
    }
    if(playerPos.y > Object.keys(map).length - 3){
        console.log(map[Math.floor(playerPos.y)][Math.floor(playerPos.x)]);
        newX = Math.floor(playerPos.x/16)*16;
        newY = Math.floor(playerPos.y/16)*16 +16;
        generate(newX, newY);
        draw();
    }
}

function cameraPosition() {
  let camerax = 300;
  let cameray = 515;
  let display = document.querySelector('#display');

  display.style.top = cameraPos.x * 32 * 0.7 + camerax + "px";
  display.style.left = cameraPos.y * 32 * 1.525 + cameray + "px";

}

function camera_old(){
  let camerax = 0;//300;
  let cameray = 0;//515;
  // let display = document.querySelector('#display');
  let display = document.querySelector('#redbox');
  
  let camX = display.style.top;
  let camY = display.style.lseft;
 
 let camera = {
   x: camX.substring(0, camX.length-2),
   y: camY.substring(0, camY.length-2)
  };

  let diffX = playerPos.x * 32 - camera.x;
  let diffY = playerPos.y * 32 - camera.y;

  let length = Math.sqrt(diffX * diffX + diffY * diffY);
  let direction = Math.atan2(diffY, diffX);

  console.log("diff: ",diffX, diffY);
  console.log(direction);

  let rotatedX = length * (Math.cos(direction - Math.PI / 4));
  let rotatedY = length * (Math.sin(direction - Math.PI / 4));

  let newCameraX = camerax + playerPos.x - rotatedX;
  let newCameraY = cameray + playerPos.y - rotatedY;

  console.log(newCameraX, newCameraY);

  display.style.top = newCameraX + "px";
  display.style.left = newCameraY + "px";
  

}