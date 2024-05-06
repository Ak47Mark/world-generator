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
            console.log("Error:", map[y][x]);
        }
    }
    mapdiv.innerHTML = drawmap;
}

function createBlockDOM(x, y){
    return "<div class='block "+toType(x,y)+" "+toObject(x, y)+"' style='background-color: "+toColor(map[y][x].weight)+";'><span>"+map[y][x].weight +"</span></div>";
}

function toType(x, y){
    let weight = map[y][x].weight;
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
    let object = map[y][x].objectID;
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
    if(initX < 0 || initY < 0){   //TODO: Lehessen negatív érték is
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
