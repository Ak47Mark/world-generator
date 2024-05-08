const fps = 30;
let debugMode = false;
let fpsCounter = 0;

setInterval(function() {
    movement();
    extendMap();
    cameraPosition();
    showInfo();
    debug();
    fpsCounter++;
}, 1000 / fps);

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