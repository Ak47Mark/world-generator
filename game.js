const fps = 30;
const mapSize = maxMapSize;
let debugMode = false;
let fpsCounter = 0;
let generator = false;

loadGame();

function repeatOften() {
    movement();
    // if(generator){extendMap()}
    cameraPosition();
    showInfo();
    debug();
    mouseEvent();   
    fpsCounter++;
requestAnimationFrame(repeatOften);
}

setInterval(function() {
    showFPS();
    fpsCounter = 0;
}, 1000);

function showFPS() {
    document.getElementById("fps").innerHTML = fpsCounter + " FPS";
}

function showInfo() {
    var info = "x: " + Math.floor(playerPos.x) + "<br/>"
            + "y: " + Math.floor(playerPos.y);

    document.getElementById("data").innerHTML = info;
}

function debug() {
    if (debugMode) {
        console.log("playerPos: " + playerPos.x + " " + playerPos.y);
    }
}

function loadGame(){
    loadBlock(mapSize, mapSize).then(function(){
        playerPos.x = mapSize / 2;
        playerPos.y = mapSize / 2;
        draw();
        requestAnimationFrame(repeatOften);
        document.querySelector("#loadScreen").style.display = "none";
    });
}

function mouseEvent(){
    if(isMouseDown){
        console.log(deltaTime(mouseDownTime, Date.now()));
    }
}