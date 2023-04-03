const fps = 30;
fpsCounter = 0;

setInterval(function() {
    movement();
    extendMap();
    cameraPosition();
    fpsCounter++;
}, 1000 / fps);

setInterval(function() {
    showInfo();
    fpsCounter = 0;
}, 1000);

function showInfo() {
    document.getElementById("info").innerHTML = fpsCounter + " FPS";
}