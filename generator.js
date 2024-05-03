const mapdiv = document.querySelector("#map");
const max = 100;
const min = 0;
const step = 5;
const size = 16;
const map = {};

var plus = 0;
var minus = 0;
var zero = 0;
generate(0,0);
draw();

function draw(){
    let drawmap = ""
    for (var y = 0; y < Object.keys(map).length; y++) {
        try{

            let row = "<div class='line'>"
            let lastKey = Object.keys(map[y])[Object.keys(map[y]).length - 1];
            for (var x = 0; x < lastKey; x++) {
                row += createBlockDOM(x, y);
            }
            row += "</div>";
            drawmap += row;
        }catch(e){
            console.log("Error:", e);
        }
    }
    mapdiv.innerHTML = drawmap;
}

function createBlockDOM(x, y){
    return "<div class='block "+toType(map[y][x])+"' style='background-color: "+toColor(map[y][x])+";'><span>"+map[y][x] +"</span></div>";
}

function toType(num){
    if(num < 5){
        return "water"
    }

    if(num < 20){
        return "sand"
    }

    if(num >= 20 && num <= 30){
        return "grass"
    }

    if(num > 25){
        if(Math.random() < (num - 25) / (max - 25)){
            return "tree";
        } else {
            return "grass";
        }
    }
}

function edgeSmooting(){
    for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
            map[y][x] = smooter(y,x);
        }
    }
}

function smooter(x,y){
    if(!(x == min || y == min || x >= max-1 || y >= max-1)){  
        var avrage = (map[x-1][y-1] + map[x-1][y] + map[x-1][y+1] + map[x][y-1] + map[x][y+1] + map[x+1][y-1] + map[x+1][y] + map[x+1][y+1])/8;
        return Math.round(avrage);
    }
    return  map[x][y];

}

function toColor(num){
    if(num < min){
        num = min;
    }

    if(num == 0){
        return "rgb(1 72 161)";
    }

    if(num == 1){
        return "rgb(0 101 227)";
    }

    if(num > 19){
        // return "rgb(225 202 117)";
    }

    return "rgb(0,"+Math.round(60/max * num + 20)+",0)";
}

function generate(initX,initY){
    if(initX < 0 || initY < 0){   //TODO: Lehessen negatív érték is
        return false;
    }
    for (var y = initY; y < size+initY; y++) {
        if(typeof map[y] === "undefined"){
            map[y] = {};
        }
        for (var x = initX; x < size+initX; x++) {
            map[y][x] = parseInt((perlin.get(y / max, x / max)) * max);
        }
    }
}