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
    for (var y = Object.keys(map).sort((a, b) => a-b )[0]; y < Object.keys(map).sort((a, b) => a-b ).reverse()[0]; y++) {
       // try{

            let row = "<div class='line' y='"+y+"'>"
            let firstKey =  0;//Object.keys(map[y]).sort((a, b) => a-b )[0];
            let lastKey = Object.keys(map[y]).sort((a, b) => a-b ).reverse()[0];
            for (var x = firstKey; x < lastKey; x++) {
                row += createBlockDOM(x, y);
            }
            row += "</div>";
            drawmap += row;
        /*}catch(e){
            console.log("Error:", map[y][x]);
        }*/
    }
    mapdiv.innerHTML = drawmap;
}

function createBlockDOM(x, y){
    return "<div x='"+x+"' y='"+y+"' class='block "+toType(x,y)+" "+toObject(x, y)+"'><span></span></div>";
}

function toType(x, y){
    let weight;
    try{
        weight = map[y][x].weight;      
    }catch(e){
        console.log("Error:", map[y][x]);
        weight = "error";
    }
    if(weight == "error"){
        return "error"
    }

    if(weight <= -15){
        return "water"
    }

    if(weight <= 0 && weight > -15){
        return "water"
    }

    if(weight > 0 && weight < 3){
        return "sand"
    }

    if(weight >= 3){
        return "grass"
    }
}

function toObject(x, y){
    let object;
    try{
        object = map[y][x].objectID;
    }catch(e){
        console.log("Error:", map[y][x]);
        object = null;
    }
    if(object == null){
        return "";
    }

    for (var i = 0; i < objtype.length; i++) {
        if (objtype[i].id == object) {
            return objtype[i].name;
        }
    }
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
    if(initX < 0 || initY < 0 /*|| initX < maxMapSize || initY < maxMapSize*/){   //TODO: Lehessen negatív érték is
        return false;
    }
    for (var y = initY; y < size+initY; y++) {
        if(typeof map[y] === "undefined"){
            map[y] = {};
        }
        for (var x = initX; x < size+initX; x++) {
            let weight = parseInt((perlin.get(y / max, x / max)) * max);
            map[y][x] = {
                            weight: weight,
                            objectID: generateObjectID(weight)
                        }
        }
    }
}

function generateObjectID(weight) {
    var obj = objtype;
    var filteredObjects = [];
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].minWeight <= weight && obj[i].maxWeight >= weight) {
            filteredObjects.push(obj[i]);
        }
    }
    if (filteredObjects.length == 0) {
        return null;
    }
    var randomIndex = Math.floor(Math.random() * filteredObjects.length);
    var randomObject = filteredObjects[randomIndex];
    var randomID = randomObject.id;
    if(randomObject.chance > Math.random()){
        return randomID;
    }

    return null;
}

async function loadBlock(tx, ty, fx = 0, fy = 0){
    return new Promise(async (resolve, reject) => {
        for(var i = fy; i <= ty; i=i+chunkSize){
            for(var j = fx; j <= tx; j=j+chunkSize){
                generate(i,j);
            }
            var percante = Math.round(i/ty*100);
            window.requestAnimationFrame(() => {
                document.querySelector("#loadBarSpan").style.width = percante + "%";
            });
            await sleep();
        }
        resolve();
    });
}

async function sleep(delay = 0) {
    return new Promise(async (resolve) => setTimeout(resolve, 0));
}

function updateWidth(percante) {
    window.requestAnimationFrame(() => {
        document.querySelector("#loadBarSpan").style.width = percante + "%";
    });
}