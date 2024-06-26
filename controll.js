const playerPos = {x: 0, y: 0};
const cameraPos = {x: 0, y: 0};
const mousePos = {x: 0, y: 0}
const chunkSize = 16;
const startPosMultiple = 1;
const maxMapSize = 50;
const seeDistance = 20;
const mouseSeeDistance = 200;
const player = document.querySelector("#player");
const up = "KeyW";
const down = "KeyS";
const left = "KeyA";
const right = "KeyD";
const shift = "ShiftLeft";
const speed = 0.1;
const sprintSpeed = 2;
const footsptepGrass = new Audio("sounds/footstep.wav");
const footsptepWater1 = new Audio("sounds/footstep-water-1.wav");
const footsptepWater2 = new Audio("sounds/footstep-water-2.wav");
const birds = new Audio("sounds/birds.wav");
const hit = new Audio("sounds/hit.wav");
const pop = new Audio("sounds/pop.wav");
let targetObject = null;

birds.loop = true;
hit.loop = true;

//movement event handler

var upKeyPressed = false;
var downKeyPressed = false;
var leftKeyPressed = false;
var rigtKeyPressed = false;
var fhiftKeyPressed = false;

playerPos.x = playerPos.x * startPosMultiple;
playerPos.y = playerPos.y * startPosMultiple;

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
    walkspeed = speed * sprintSpeed;
  }else{
    walkspeed = speed;
  }

  if (upKeyPressed) {
    if(playerPos.x > 1){
      playerPos.x -= walkspeed;     //fel
    }
    if(playerPos.y > 1){
      playerPos.y -= walkspeed;
    }
  }
  if (downKeyPressed) {
    if(playerPos.x < maxMapSize + chunkSize - 1){
      playerPos.x += walkspeed;     //le
    }
    if(playerPos.y < maxMapSize + chunkSize - 1){
      playerPos.y += walkspeed;
    }
  }
  if (leftKeyPressed) {
    if(playerPos.y < maxMapSize + chunkSize - 1){
      playerPos.y += walkspeed;    //bal
    }
    if(playerPos.x > 1){
      playerPos.x -= walkspeed;
    }
  }
  if (rigtKeyPressed) {
    if(playerPos.y > 1){
      playerPos.y -= walkspeed;   //jobb
    }
    if(playerPos.x < maxMapSize + chunkSize - 1){
      playerPos.x += walkspeed;
    }
  }

  if( upKeyPressed || downKeyPressed || leftKeyPressed || rigtKeyPressed){
    if(map[Math.floor(playerPos.y)][Math.floor(playerPos.x)].weight > 0){
      footsptepGrass.play();
    }else{
      footsptepWater1.play();
      footsptepGrass.pause();
    }
  }else{
    footsptepGrass.pause();
  }

  player.style.zIndex = Math.round(pythagoras((playerPos.x), (playerPos.y)));
  player.style.left = Math.round(playerPos.x*34) + "px";
  player.style.top = Math.round(playerPos.y*34) + "px";
}

function extendMap(){
  generateCircleCoordinates(Math.floor(playerPos.x), Math.floor(playerPos.y), seeDistance).forEach((coord) => {
    if(coord.x > 0 && coord.y > 0 && coord.x < maxMapSize && coord.y < maxMapSize){ //TODO: negatív irányba is csak akkor belassul
      newX = Math.floor(coord.x/chunkSize)*chunkSize;
      newY = Math.floor(coord.y/chunkSize)*chunkSize;
      try{
        if(typeof map[coord.y][coord.x] == 'undefined'){
          generate(newX, newY);
          draw();
        }
      }catch(e){
        generate(newX, newY);
        draw();
      }
    }
  });
}

function generateCircleCoordinates(x, y, distance) {
  const coordinates = [];
  for (let i = x - distance; i <= x + distance; i++) {
    for (let j = y - distance; j <= y + distance; j++) {
      if (Math.sqrt((i - x) ** 2 + (j - y) ** 2) <= distance) {
        coordinates.push({ x: i, y: j });
      }
    }
  }
  return coordinates;
}

let screen = document.getElementById('screen');
let mapscreen = document.getElementById('map');
screen.addEventListener('mousemove', function(event) {
    mousePos.x = event.clientX;
    mousePos.y = event.clientY;
});

let mouseDownTime = 0;
let isMouseDown = false;

mapscreen.addEventListener('mousedown', function(event) {
  isMouseDown = true;
  mouseDownTime = Date.now();
  let target = event.target;
  try{
    x = target.parentElement.attributes['x'].value;
    y = target.parentElement.attributes['y'].value;
  }catch(e){
    console.error(target.parentElement);
    x = 999;
    y = 999;
  }
    let distance = Math.sqrt((playerPos.x - x) ** 2 + (playerPos.y - y) ** 2);
  if (distance < 5) {
    hit.play();
    targetObject = setTargetObject(x, y, map[y][x].objectID);
    hitObject(x, y, map[y][x].objectID);
  }
});

document.addEventListener('mouseup', function() {
  isMouseDown = false;
  hit.pause();
  hit.currentTime = 0;
  let mouseUpTime = Date.now();
});

function destroyBlock(x, y){
  map[y][x].objectID = null;
  pop.play();
  draw();
}

function setTargetObject(x, y, objectId){
  if(objectId == null){
    return null;
  }
  return {x, y, objectId};
}

function hitObject(){
  var dTime = deltaTime(mouseDownTime, Date.now());
  if(targetObject == null){
    return;
  }
  let object = objtype.find(obj => obj.id == targetObject.objectId);
  if(dTime > object.strength && targetObject != null){
    hit.pause();
    hit.currentTime = 0;
    destroyBlock(targetObject.x, targetObject.y);
    targetObject = null;
  }
}

function deltaTime(then, now){
  return (now - then);
}

function cameraPosition() {
  let player = document.getElementById('player').getBoundingClientRect();
  // let position = element.getBoundingClientRect();
  let display = document.querySelector('#display');
  let displayPos = display.getBoundingClientRect();
  let x = Math.floor(player.left - displayPos.left);
  let y = Math.floor(player.top - displayPos.top);

  let windowWidth = window.innerWidth;
  let screenCenterX = window.innerWidth / 2;
  let distanceFromCenterX = mousePos.x - screenCenterX;
  let normalizedValueX = (distanceFromCenterX / screenCenterX) * mouseSeeDistance * -1;
  
  let windowHeight = window.innerHeight;
  let screenCenterY = window.innerHeight / 2;
  let distanceFromCenterY = mousePos.y - screenCenterY;
  let normalizedValueY = (distanceFromCenterY / screenCenterX) * mouseSeeDistance * -1;
  
  display.style.top = (y * -1 + windowHeight / 2 + normalizedValueY) + "px";
  display.style.left = (x * -1 + windowWidth / 2 + normalizedValueX) + "px";
}