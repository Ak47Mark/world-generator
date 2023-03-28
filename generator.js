const mapdiv = document.querySelector("#map");
const max = 10;
const min = 0;
const step = 2;
const size = 160;
const map = {};


generate();
console.log(map);
draw();

function draw(){
    let drawmap = ""
    console.log(Object.keys(map).length);
    for (var y = 0; y < size; y++) {
        let row = "<div class='line'>"
        for (var x = 0; x < size; x++) {
            row += "<div class='block' style='background-color: rgb(0,"+toColor(map[y][x])+",0);'>"+ map[y][x] +"</div>";
        }
        row += "</div>";
        drawmap += row;
    }
    console.log(drawmap);
    mapdiv.innerHTML = drawmap;
}

function toColor(num){
    return Math.round(255/max * num);
}

function generate(){
    for (var y = 0; y < size; y++) {
        map[y] = {};
        for (var x = 0; x < size; x++) {
            map[y][x] = newBlock(y,x);
        }
    }
}

function newBlock(y, x){

    if (x == 0 && y == 0 ){
        let block = Math.round(Math.random() * max);
        return block;
    }
    
    if (y == 0){
        let block = map[y][x-1] + stepper();
        return limitter(block);
    }

    if (x == 0){
        let block = map[y-1][x] + stepper();
        return limitter(block);
    }
    
    let block = Math.round((map[y-1][x] + map[y][x-1])/2) + stepper();;
    return limitter(block);

}

function stepper(){
    let s = Math.round((Math.random() * step * 2) - step);
    return s;
}

function limitter(num){
    if(num > max){
        return max;
    }

    if(num < min){
        return min;
    }

    return num;
}